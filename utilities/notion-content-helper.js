const fs = require('fs-extra')
const path = require('path')
const https = require('https')
const _ = require('lodash')

const imagesDir = path.join(
  __dirname,
  '../',
  process.env.DIR_IMAGES || './public/images'
)

/**
 *  Get Notion content data
 *
 * @param {import('@notionhq/client/build/src/api-endpoints').ListBlockChildrenResponse} queryResponse
 * @returns content object
 */
function getContentData(queryResponse) {
  let content = []
  content = queryResponse.results.map((block) => {
    let cnt = {}
    cnt.id = block.id
    cnt.type = block.type
    cnt.data = getDataValue(block)
    return cnt
  })

  return content
}

/**
 * Get Notion data value
 *
 * @param {import('@notionhq/client/build/src/api-endpoints').PartialBlockObjectResponse | import('@notionhq/client/build/src/api-endpoints').BlockObjectResponse} block
 */
function getDataValue(block) {
  try {
    const handler = typeMappingHandlers[block?.type]
    return handler ? handler(block) : { value: '' } // Nếu không tìm thấy handler, trả về giá trị mặc định
  } catch (error) {
    console.error(`[getDataValue] Exception : ${error}`)
    return { value: '' } // Trả về giá trị mặc định khi gặp lỗi
  }
}

/**
 * Handle Get value by Notion Types
 */
const typeMappingHandlers = {
  heading_1: handleHeadingOrParagraph,
  heading_2: handleHeadingOrParagraph,
  heading_3: handleHeadingOrParagraph,
  paragraph: handleHeadingOrParagraph,
  bulleted_list_item: handleListItem,
  numbered_list_item: handleListItem,
  image: handleImage,
  callout: handleCallout,
  video: handleVideo,
}

function handleHeadingOrParagraph(block) {
  return {
    value:
      block[block.type]?.rich_text
        ?.map((text) => stylePlainText(text))
        .join('') || '',
  }
}

function handleListItem(block) {
  return {
    value: JSON.stringify({
      content:
        block[block.type]?.rich_text
          ?.map((text) => stylePlainText(text))
          .join('') || '',
      hasChildren: block?.has_children,
      items: [],
    }),
  }
}

function handleImage(block) {
  const data = { value: '' }
  if (block?.image?.file?.url) {
    const extension = getFileExtension(block.image.file.url)
    downloadImage(
      block.image.file.url,
      `${imagesDir}/${block?.id}.${extension}`
    )
    data.value = `/images/${block?.id}.${extension}`
  }
  if (block?.image?.caption?.length) {
    data.caption =
      block?.image?.caption?.map((text) => stylePlainText(text)).join('') || ''
  }
  return data
}

function handleCallout(block) {
  return {
    value: JSON.stringify({
      title:
        block?.callout?.rich_text
          ?.map((text) => stylePlainText(text))
          .join('') || '',
      icon: block?.callout?.icon?.emoji,
      hasChildren: block?.has_children,
      items: [],
    }),
  }
}

function handleVideo(block) {
  return {
    value: block?.video?.external?.url || '',
  }
}

/**
 * Add plain text into HTML tags
 *
 * @param {string} text Text string
 * @returns string
 */
function stylePlainText(text) {
  let resultStyle = text.plain_text
  if (text.annotations.bold) resultStyle = `<b>${text.plain_text}</b>`
  else if (text.annotations.italic)
    resultStyle = `<span class="italic">${text.plain_text}</span>`
  else if (text.annotations.strikethrough)
    resultStyle = `<span class="line-through">${text.plain_text}</span>`
  else if (text.annotations.underline)
    resultStyle = `<span class="underline">${text.plain_text}</span>`

  let result = resultStyle
  if (text.href)
    result = `<a href="${text.href}" class="notion-link" target="_blank">${resultStyle}</a>`

  return result
}

/**
 * Get extension of file in URL
 *
 * @param {string} url URL
 * @returns string
 */
function getFileExtension(url) {
  // Lấy phần trước dấu `?` để loại bỏ các tham số truy vấn
  const cleanUrl = url.split('?')[0]

  // Lấy phần sau dấu chấm cuối cùng
  return cleanUrl.substring(cleanUrl.lastIndexOf('.') + 1)
}

/**
 * Download image from URL to folder path
 *
 * @param {string} url URL
 * @param {string} filepath File Path
 */
function downloadImage(url, filepath) {
  if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir)

  const file = fs.createWriteStream(filepath)
  https.get(url, (response) => {
    response.pipe(file)
    file.on('finish', () => file.close())
  })
}

/**
 * Remove all images in public folder
 *
 */
async function removeAllImages() {
  try {
    fs.readdir(imagesDir, async (err, files) => {
      if (err) {
        console.error(`Error reading directory: ${err}`)
        return
      }

      await fs.emptyDir(imagesDir)
      console.log('Empty directory successfully!')
    })
  } catch (err) {
    console.log(`Error emptying directory ${imagesDir}.`, err)
  }
}

/**
 *
 * @param {string} value Value
 * @returns string
 */
function generateUrl(value) {
  let converted = removeVietnameseTones(value)
  converted = _.kebabCase(converted)
  return converted
}

/**
 * Remove vietnamese accents
 *
 * @param {string} str String Value
 * @returns string
 */
function removeVietnameseTones(str) {
  return str
    .normalize('NFD') // Chuyển đổi sang dạng Normalization Form D
    .replace(/[\u0300-\u036f]/g, '') // Loại bỏ các dấu kết hợp (combining diacritical marks)
    .replace(/đ/g, 'd') // Thay thế chữ "đ" thường
    .replace(/Đ/g, 'D') // Thay thế chữ "Đ" hoa
    .replace(/[^a-zA-Z0-9\s]/g, '') // Loại bỏ các ký tự đặc biệt (tuỳ chọn)
}

module.exports = {
  getContentData,
  removeAllImages,
  generateUrl,
}
