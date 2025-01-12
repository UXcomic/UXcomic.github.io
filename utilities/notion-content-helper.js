const fs = require('fs-extra')
const https = require('https')

const imagesDir = process.env.DIR_IMAGES || './public/images'

/**
 *
 * @param {import('@notionhq/client/build/src/api-endpoints').ListBlockChildrenResponse} queryResponse
 * @returns
 */
const getContentData = (queryResponse) => {
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
 *
 * @param {import('@notionhq/client/build/src/api-endpoints').PartialBlockObjectResponse | import('@notionhq/client/build/src/api-endpoints').BlockObjectResponse} block
 */
const getDataValue = (block) => {
  try {
    let data = { value: '' }
    switch (block?.type) {
      case 'heading_1':
      case 'heading_2':
      case 'heading_3':
      case 'paragraph':
        data.value =
          block[block.type]?.rich_text
            ?.map((text) => stylePlainText(text))
            .join('') || ''
        break
      case 'bulleted_list_item':
      case 'numbered_list_item':
        data.value = JSON.stringify({
          content:
            block[block.type]?.rich_text
              ?.map((text) => stylePlainText(text))
              .join('') || '',
          hasChildren: block?.has_children,
          items: [],
        })
        break
      case 'image':
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
            block?.image?.caption
              ?.map((text) => stylePlainText(text))
              .join('') || ''
        }
        break
      case 'divider':
        break
      case 'callout':
        data.value = JSON.stringify({
          title:
            block?.callout?.rich_text
              ?.map((text) => stylePlainText(text))
              .join('') || '',
          icon: block?.callout?.icon?.emoji,
          hasChildren: block?.has_children,
          items: [],
        })
        break
      case 'video':
        data.value = block?.video?.external?.url || ''
        break
    }
    return data
  } catch (error) {
    console.error(`[getDataValue] Exception : ${error}`)
  }
}

const removeAllImages = () => {
  fs.emptyDir(imagesDir)
    .then(() => console.log(`Emptied directory: ${imagesDir}`))
    .catch((err) =>
      console.error(`Error emptying directory ${imagesDir}.`, err)
    )
}

const getFileExtension = (url) => {
  // Lấy phần trước dấu `?` để loại bỏ các tham số truy vấn
  const cleanUrl = url.split('?')[0]

  // Lấy phần sau dấu chấm cuối cùng
  return cleanUrl.substring(cleanUrl.lastIndexOf('.') + 1)
}

const downloadImage = (url, filepath) => {
  if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir)

  const file = fs.createWriteStream(filepath)
  https.get(url, (response) => {
    response.pipe(file)
    file.on('finish', () => file.close())
  })
}

const stylePlainText = (text) => {
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

module.exports = {
  getContentData,
  removeAllImages,
}
