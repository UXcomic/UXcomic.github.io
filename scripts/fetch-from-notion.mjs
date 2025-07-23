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

  // Remove unused images
  // const cloudinaryImages = await cloudinary.api.resources_by_asset_folder('uxcomic-imgs')
}

function generateRoutes() {
  processGeneratePostRoutes()
  processGenerateBlogRoutes()
}

function processGeneratePostRoutes() {
  postsData.forEach((post) => {
    const slug = toSlug(post.properties?.Name?.title[0]?.text?.content || 'Unknown')
    postRoutes.push({ slug })
  })
}

function processGenerateBlogRoutes() {
  blogsData.forEach((cate) => {
    cate.tags.forEach((tagItem) => {
      blogRoutes.push({ category: cate.slug, tag: tagItem.slug })
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

function processCreateSitemapFile() {
  const baseUrl = process.env['BASE_URL']
  const today = new Date().toISOString().split('T')[0] // yyyy-mm-dd
  let urls = []

  postRoutes.forEach((route) => {
    urls.push({
      loc: `${baseUrl}/post/${route.slug}`,
      lastmod: today,
    })
  })

  blogRoutes.forEach((route) => {
    urls.push({
      loc: `${baseUrl}/blog/${route.category}/${route.tag}`,
      lastmod: today,
    })
  })

  const outputFile = path.join(outputDir, '../sitemap.xml')
  let existingLocs = new Set()

  // Đọc sitemap.xml nếu đã tồn tại và lấy các loc cũ
  if (fs.existsSync(outputFile)) {
    const oldContent = fs.readFileSync(outputFile, 'utf-8')
    const locMatches = [...oldContent.matchAll(/<loc>(.*?)<\/loc>/g)]
    locMatches.forEach((match) => existingLocs.add(match[1]))
  }

  // Chỉ thêm url mới chưa có
  const newUrls = urls.filter((url) => !existingLocs.has(url.loc))

  // Nếu không có url mới thì không cần ghi lại file
  if (newUrls.length === 0) {
    console.log('✅ No new URLs to add to sitemap.xml')
    return
  }

  // Gộp url cũ và url mới
  let allUrls = []
  if (fs.existsSync(outputFile)) {
    // Parse lại các url cũ
    const oldContent = fs.readFileSync(outputFile, 'utf-8')
    const urlMatches = [...oldContent.matchAll(/<url>([\s\S]*?)<\/url>/g)]
    urlMatches.forEach((match) => allUrls.push(match[1].trim()))
  }
  // Thêm các url mới
  allUrls.push(
    ...newUrls.map(
      (url) =>
        `<url>
          <loc>${url.loc}</loc>
          <lastmod>${url.lastmod}</lastmod>
        </url>`,
    ),
  )

  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${allUrls.join('\n')}
    </urlset>`

  fs.writeFileSync(outputFile, sitemapContent, 'utf-8')
  console.log(`✅ Added ${newUrls.length} new URLs to sitemap.xml at ${outputFile}`)
}
