import { Client } from '@notionhq/client'
import * as dotenv from 'dotenv'
import * as fs from 'fs'
import * as path from 'path'
import * as https from 'https'
import { fileURLToPath } from 'url'
import { v2 as cloudinary } from 'cloudinary'

dotenv.config()

cloudinary.config({
  cloud_name: process.env['CLOUDINARY_CLOUD_NAME'],
  api_key: process.env['CLOUDINARY_API_KEY'],
  api_secret: process.env['CLOUDINARY_API_SECRET'],
})

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const outputDir = path.join(__dirname, '../public/data')
const imgsDir = path.join(__dirname, '../public/imgs')

const notion = new Client({ auth: process.env['NOTION_API_KEY'] })
const rootDatabaseId = process.env['NOTION_ROOT_DATABASE_ID']

let blogsData = []
let blogChildDatabases = []
let postsData = []
let blogRoutes = []
let postRoutes = []

fetchAll().catch((err) => {
  console.error('❌ Error fetching Notion data:', err)
})

async function fetchAll() {
  if (!rootDatabaseId) throw new Error('Missing NOTION_ROOT_DATABASE_ID')

  createDirectory()
  await fetchCategories()
  await fetchTags()
  await fetchPosts()
  generateRoutes()
  createFiles()
}

function createDirectory() {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
    console.log(`📁 Created directory: ${outputDir}`)
  }
}

async function fetchCategories() {
  const response = await notion.databases.query({
    database_id: rootDatabaseId,
  })

  blogsData = response.results.map((cate) => ({
    id: cate.id,
    name: cate.properties.Name?.title?.[0]?.plain_text || 'Unknown',
    slug: toSlug(cate.properties.Name?.title?.[0]?.plain_text) || null,
    icon: cate.icon.emoji,
    order: parseInt(cate.properties.Number?.number || '-1'),
    created_time: cate.created_time,
    tags: [],
  }))
}

async function fetchTags() {
  for (let i = 0; i < blogsData.length; i++) {
    const categoryData = blogsData[i]
    const block = await notion.blocks.children.list({
      block_id: categoryData.id,
    })
    const childDatabase = block.results.filter((item) => item.type == 'child_database')[0]
    const databaseInfo = await notion.databases.retrieve({
      database_id: childDatabase.id,
    })

    categoryData.tags = databaseInfo.properties.Tag.select.options.map((item) => ({
      id: item.id,
      name: item.name.split('-')[1],
      slug: toSlug(item.name.split('-')[1]),
      order: parseInt(item.name.split('-')[0] || '-1'),
    }))
    blogChildDatabases.push(childDatabase)
  }
}

async function fetchPosts() {
  for (let i = 0; i < blogChildDatabases.length; i++) {
    const blogChildDatabase = blogChildDatabases[i]
    const databaseId = blogChildDatabase.id
    const data = await notion.databases.query({ database_id: databaseId })
    const aboutPost = await notion.pages.retrieve({ page_id: process.env['NOTION_ABOUT_POST_ID'] })
    const publishedPostsData = data.results.filter((post) => post.properties.Publish.checkbox)
    addPostCategoryAndTag(publishedPostsData, blogChildDatabase)
    publishedPostsData.push(aboutPost)
    await fetchContents(publishedPostsData)
    postsData.push(...publishedPostsData)
  }
}

function addPostCategoryAndTag(postsData, blogChildDatabase) {
  for (let i = 0; i < postsData.length; i++) {
    const postData = postsData[i]
    const postCategoryId = blogChildDatabase.parent.page_id
    const postTagId = postData.properties.Tag.select.id
    const { category, tag } = processAddCategoryAndTag(postTagId, postCategoryId)
    postData.category = category
    postData.tag = tag
  }
}

function processAddCategoryAndTag(postTagId, postCategoryId) {
  let categoryData = null
  let tagData = null

  for (let i = 0; i < blogsData.length; i++) {
    const category = blogsData[i]
    for (let j = 0; j < category.tags.length; j++) {
      const tag = category.tags[j]
      if (category.id === postCategoryId && tag.id === postTagId) {
        categoryData = category
        tagData = tag
        break
      }
    }

    if (!!categoryData && !!tagData) break
  }

  return { category: categoryData, tag: tagData }
}

async function fetchContents(postsData) {
  for (let i = 0; i < postsData.length; i++) {
    const postData = postsData[i]
    let contentResult = await processFetchContent(postData)
    await fetchChildren(contentResult, postData)
    postData.content = contentResult
  }
}

async function fetchChildren(contentArray, parentPostData = undefined) {
  for (let i = 0; i < contentArray.length; i++) {
    if (!contentArray[i].has_children) continue
    contentArray[i].children = await processFetchContent(contentArray[i], parentPostData)
  }
}

async function processFetchContent(postData, parentPostData = undefined) {
  let contentData = await notion.blocks.children.list({
    block_id: postData.id,
  })
  processCountNumberedListItem(contentData.results)

  const sanitizedTitle = getSantinizeTitle(parentPostData || postData)
  const titleSlug = toSlug(sanitizedTitle)
  // await handleImageBlocks(titleSlug, contentData.results)
  await handleUploadImagesToCloudinary(contentData.results)

  return contentData.results
}

function getSantinizeTitle(postData) {
  const articleTitle = postData.properties?.Name?.title[0]?.text?.content || 'Unknown'
  const sanitizedTitle = articleTitle.replace(/[<>:"/\\|?*\x00-\x1F]/g, '_')
  return sanitizedTitle
}

function processCountNumberedListItem(content) {
  let counter = 0
  for (let i = 0; i < content.length; i++) {
    let c = content[i]
    if (c.type === 'numbered_list_item') c.index = counter++
    else counter = 0
  }
}

async function handleImageBlocks(titleSlug, contentArray) {
  const usedImageIdsPerArticle = {}

  for (const obj of contentArray) {
    if (obj.type === 'image' && obj.image?.file?.url) {
      const imageUrl = obj.image.file.url

      const articleDir = path.join(imgsDir, titleSlug)

      if (!fs.existsSync(articleDir)) {
        fs.mkdirSync(articleDir, { recursive: true })
        console.log(`Created folder for article: ${titleSlug}`)
      }

      const extMatch = new URL(imageUrl).pathname.match(/\.(jpg|jpeg|png|webp|gif)$/i)
      const ext = extMatch ? extMatch[0] : '.jpg'

      const currentImageId = obj.id
      const imageFileName = `${currentImageId}${ext}`
      const savePath = path.join(articleDir, imageFileName)
      const relativePath = `/imgs/${titleSlug}/${imageFileName}`

      if (!usedImageIdsPerArticle[titleSlug]) {
        usedImageIdsPerArticle[titleSlug] = new Set()
      }
      usedImageIdsPerArticle[titleSlug].add(currentImageId)

      if (fs.existsSync(savePath)) {
        console.log(`Image already exists: ${relativePath}, skipping download.`)
        obj.image.file.url = relativePath
        continue
      }

      try {
        console.log(`Downloading image: ${imageFileName} -> ${relativePath}`)
        await downloadImage(imageUrl, savePath)
        obj.image.file.url = relativePath
      } catch (err) {
        console.error(`Failed to download image: ${imageUrl}`, err.message)
      }
    }
  }

  for (const [articleTitle, usedIds] of Object.entries(usedImageIdsPerArticle)) {
    const articleDir = path.join(imgsDir, articleTitle)
    const files = fs.readdirSync(articleDir)

    for (const file of files) {
      const idFromFile = file.split('.')[0] // lấy phần trước dấu chấm
      if (!usedIds.has(idFromFile)) {
        const filePath = path.join(articleDir, file)
        fs.unlinkSync(filePath)
        console.log(`Removed unused image: ${path.join('/imgs', articleTitle, file)}`)
      }
    }
  }
}

async function downloadImage(imageUrl, savePath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(savePath)
    https
      .get(imageUrl, (response) => {
        if (response.statusCode !== 200) {
          return reject(new Error(`Failed to get '${imageUrl}' (${response.statusCode})`))
        }

        response.pipe(file)
        file.on('finish', () => file.close(resolve))
      })
      .on('error', (err) => {
        fs.unlink(savePath, () => reject(err))
      })
  })
}

async function handleUploadImagesToCloudinary(contentArray) {
  let uploadedCount = 0
  let failedCount = 0
  let usedImagePublicIds = []

  for (const obj of contentArray) {
    if (obj.type === 'image' && obj.image?.file?.url) {
      const imageUrl = obj.image.file.url
      try {
        const result = await cloudinary.uploader.upload(imageUrl, {
          public_id: obj.id,
          folder: 'uxcomic-imgs',
          overwrite: false,
        })
        obj.image.file.url = result.secure_url
        obj.public_id = result.public_id
        usedImagePublicIds.push(result.public_id)
        uploadedCount++
        console.log(`[Cloudinary] Success: ${result.secure_url}`)
      } catch (err) {
        failedCount++
        console.error(`[Cloudinary] Failed to upload: ${imageUrl}`, err.message)
      }
    }
  }

  // TODO Remove unused images
}

function generateRoutes() {
  processGeneratePostRoutes()
  processGenerateBlogRoutes()
}

function processGeneratePostRoutes() {
  postsData.forEach((post) => {
    const slug = toSlug(post.properties?.Name?.title[0]?.text?.content || 'Unknown')
    postRoutes.push({ slug, lastEditedTime: post.last_edited_time })
  })
}

function processGenerateBlogRoutes() {
  blogsData.forEach((cate) => {
    cate.tags.forEach((tagItem) => {
      blogRoutes.push({ category: cate.slug, tag: tagItem.slug, createdTime: cate.created_time })
    })
  })
}

function toSlug(title) {
  return title
    .toLowerCase()
    .normalize('NFD') // Remove accents
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphen
    .replace(/^-+|-+$/g, '') // Trim hyphens
}

function createFiles() {
  processCreateCategoriesAndTagsFile()
  processPostsFile()
  processBlogRoutesFile()
  processPostRoutesFile()
  processCreateSitemapFile()
  processCreateSitemapTxtFile()
}

function processCreateCategoriesAndTagsFile() {
  if (!blogsData.length) return

  const outputFile = path.join(outputDir, 'categoriesAndTags.json')
  fs.writeFileSync(outputFile, JSON.stringify(blogsData, null, 2), 'utf-8')
  console.log(`✅ Saved Notion categories and tags data to ${outputFile}`)
}

function processPostsFile() {
  if (!postsData.length) return

  const outputFile = path.join(outputDir, 'posts.json')
  fs.writeFileSync(outputFile, JSON.stringify(postsData, null, 2), 'utf-8')
  console.log(`✅ Saved Notion posts data to ${outputFile}`)
}

function processBlogRoutesFile() {
  const outputPath = path.join(outputDir, 'blogRoutes.json')
  fs.writeFileSync(outputPath, JSON.stringify(blogRoutes, null, 2))
  console.log(`✅ Saved ${blogRoutes.length} routes to ${outputPath}`)
}

function processPostRoutesFile() {
  const outputPath = path.join(outputDir, 'postRoutes.json')
  fs.writeFileSync(outputPath, JSON.stringify(postRoutes, null, 2))
  console.log(`✅ Saved ${postRoutes.length} routes to ${outputPath}`)
}

// Giả sử postRoutes và blogRoutes đã được định nghĩa và có dữ liệu tương tự như bạn mô tả
// Ví dụ cấu trúc dữ liệu:
// const postRoutes = [
//   { slug: 'bai-viet-1', lastEditedTime: '2024-07-28T10:00:00+07:00' },
//   { slug: 'bai-viet-2', lastEditedTime: '2024-07-27T15:30:00+07:00' },
// ];
// const blogRoutes = [
//   { category: 'cong-nghe', tag: 'lap-trinh', createdTime: '2024-07-26T08:00:00+07:00' },
// ];
// const outputDir = __dirname; // Hoặc đường dẫn thư mục output thực tế của bạn

function processCreateSitemapFile() {
  const baseUrl = process.env['BASE_URL'] || 'https://your-website.com' // Đảm bảo BASE_URL được định nghĩa hoặc có giá trị mặc định
  let urls = []

  // Hàm helper để định dạng ngày tháng sang W3C Datetime
  const formatLastMod = (dateString) => {
    try {
      // Đảm bảo dateString là định dạng ISO 8601 hoặc có thể được parse bởi Date
      const date = new Date(dateString)
      // Lấy phần YYYY-MM-DD
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    } catch (error) {
      console.warn(`Could not parse date string: ${dateString}. Using current date as fallback.`)
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const day = String(now.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }
  }

  postRoutes.forEach((route) => {
    if (route.slug !== 'unknown') {
      urls.push({
        loc: `${baseUrl}/post/${route.slug}`,
        lastmod: formatLastMod(route.lastEditedTime),
        changefreq: 'monthly',
        priority: '0.64',
      })
    }
  })

  blogRoutes.forEach((route) => {
    urls.push({
      loc: `${baseUrl}/blog/${route.category}/${route.tag}`,
      lastmod: formatLastMod(route.createdTime),
      changefreq: 'monthly',
      priority: '0.64', // Có thể điều chỉnh priority tùy theo mức độ quan trọng
    })
  })

  // Thêm các URL tĩnh (trang chủ, về chúng tôi,...)
  urls.push({
    loc: `${baseUrl}/`,
    changefreq: 'monthly',
    priority: '1.00',
  })
  urls.push({
    loc: `${baseUrl}/about`,
    changefreq: 'monthly',
    priority: '0.80',
  })

  // Tạo nội dung XML cho từng URL
  const urlEntries = urls.map(
    (url) =>
      `<url>\n  <loc>${url.loc}</loc>\n  ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>\n  ` : ''}<changefreq>${url.changefreq}</changefreq>\n  <priority>${url.priority}</priority>\n</url>`,
  )

  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries.join('\n')}\n</urlset>`

  const outputFile = path.join(outputDir, '../sitemap.xml') // Đảm bảo đường dẫn đúng
  fs.writeFileSync(outputFile, sitemapContent, 'utf-8')
  console.log(`✅ Added ${urls.length} URLs to sitemap.xml at ${outputFile}`)
}

function processCreateSitemapTxtFile() {
  const baseUrl = process.env['BASE_URL'] || 'https://your-website.com'
  let urls = []

  postRoutes.forEach((route) => {
    if (route.slug !== 'unknown') {
      urls.push(`${baseUrl}/post/${route.slug}`)
    }
  })

  blogRoutes.forEach((route) => {
    urls.push(`${baseUrl}/blog/${route.category}/${route.tag}`)
  })

  // Thêm các URL tĩnh (trang chủ, về chúng tôi,...)
  urls.push(`${baseUrl}/`)
  urls.push(`${baseUrl}/about`)

  const outputFile = path.join(outputDir, '../sitemap.txt')
  fs.writeFileSync(outputFile, urls.join('\n'), 'utf-8')
  console.log(`✅ Saved ${urls.length} URLs to sitemap.txt at ${outputFile}`)
}
