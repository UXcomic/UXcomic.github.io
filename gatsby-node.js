const path = require('path')
const notion = require('./utilities/notion-sdk-helper')
const contentHelper = require('./utilities/notion-content-helper')
const _ = require('lodash')

/**
 * GATSBY CREATE NODES
 * @param {*} param0
 */
exports.sourceNodes = async ({
  actions,
  createNodeId,
  createContentDigest,
}) => {
  const { createNode, createTypes } = actions

  createTypes(`
    type NotionCategory {
      id: String
      title: String
      icon: String
      url: String
    }

    type NotionTag {
      id: String
      name: String
      title: String
      order: Int
      databaseId: String
      categoryId: String
      url: String
    }

    type NotionData {
      value: String
      caption: String
    }

    type NotionContent {
      id: String
      type: String
      data: NotionData
    }

    type NotionPostBase {
      id: String
      title: String
      publish: String
      cover: String
      type: String
      createdTime: String
      url: String
      tag: NotionTag
      category: NotionCategory
      content: [NotionContent]
    }

    type NotionPost implements Node @dontInfer {
      post: NotionPostBase
    }
  `)

  let notionPosts = []

  contentHelper.removeAllImages()

  // Get Categories
  const categories = await getCategories()
  for (let i = 0; i < categories.length; i++) {
    let tmpPost = {}
    const category = categories[i]
    tmpPost.category = category

    // Get Tags
    const tags = await getTags(category.id)
    for (let j = 0; j < tags.length; j++) {
      const tag = tags[j]
      tmpPost.tag = tag

      // Get Posts
      let posts = await getPosts(tag.databaseId, tag.name, tag.id, category.id)
      for (let k = 0; k < posts.length; k++) {
        let tmpContent = []
        let post = posts[k]
        tmpContent = await getContent(post.id)

        if (!tmpContent.length) continue

        // Set Post Cover By First Image of Content
        post.cover = process.env.GATSBY_THUMBNAIL_DEFAULT
        const firstImg = tmpContent.find((cnt) => cnt.type === 'image')
        if (firstImg) {
          post.cover = firstImg.data.value // Get first image in content
          tmpContent = tmpContent.filter((cnt) => cnt.id !== firstImg.id) // Remove first image because of cover post
        }

        // Get CallOut Items
        for (let u = 0; u < tmpContent.length; u++) {
          let cnt = tmpContent[u]
          if (cnt.type === 'callout') {
            let tmpData = JSON.parse(cnt.data.value)
            tmpData.items = await getContent(cnt.id)
            cnt.data.value = JSON.stringify(tmpData)
          }
        }

        post.content = tmpContent
      }

      posts = posts
        .filter((post) => !!post?.id)
        .map((post) => ({ ...post, ...tmpPost }))

      notionPosts.push(...posts)
    }
  }

  // Node Posts
  notionPosts.forEach((post) => {
    // Create node each post
    createNode({
      id: createNodeId(`NotionPost-${post.id}`),
      parent: null,
      children: [],
      internal: {
        type: 'NotionPost', // Node name
        contentDigest: createContentDigest(post),
      },
      // Save into GraphQL
      post,
      // More properties from Notion API
    })
  })
}

/**
 * GATSBY CREATE PAGES
 * @param {*} param0
 */
exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const result = await graphql(`
    query {
      allNotionPost {
        nodes {
          post {
            id
            title
            publish
            cover
            createdTime
            url
            category {
              id
              title
              icon
              url
            }
            tag {
              id
              name
              title
              order
              databaseId
              categoryId
              url
            }
            content {
              id
              type
              data {
                value
                caption
              }
            }
          }
        }
      }
    }
  `)

  if (result.errors) throw result.errors

  let notionPosts = result.data.allNotionPost.nodes

  notionPosts.forEach(({ post }) => {
    createPage({
      path: `/bai-viet/${post.category.url}/${post.tag.url}/${post.url}`,
      component: path.resolve(`./src/templates/post-template.tsx`),
      context: {
        id: post.id,
        title: post.title,
        description: post.content?.find((cnt) => cnt.type === 'paragraph')?.data
          .value,
        cover: post.cover,
        tagId: post.tag.id,
        categoryId: post.category.id,
      },
    })
  })
}

/**
 * PRIVATE FUNCTIONS
 */
const getCategories = async () => {
  try {
    const rootBlockChildren = await notion.blocks.children.list({
      block_id: process.env.ROOT_PAGE_ID,
    })
    const database =
      rootBlockChildren.results[
        rootBlockChildren.results.findIndex(
          (block) => block.type == 'child_database'
        )
      ] || null
    const categoriesResponse = await notion.databases.query({
      database_id: database.id,
      sorts: [
        // {
        //   property: 'Name',
        //   direction: 'ascending',
        // },
        {
          property: 'Number',
          direction: 'ascending',
        },
      ],
    })

    const data = categoriesResponse.results
      .filter((item) => item.properties.Publish?.checkbox)
      .map((item) => ({
        id: item.id,
        title: item.properties?.Name?.title[0].plain_text,
        icon: item.icon?.emoji,
        url: generateUrl(item.properties?.Name?.title[0].plain_text),
      }))

    return data
  } catch (error) {
    console.error('[getCategories] Notion API Error:', JSON.stringify(error))

    return []
  }
}

const getTags = async (blockId) => {
  try {
    if (!blockId) return []
    const blockChildren = await notion.blocks.children.list({
      block_id: blockId,
    })
    const database =
      blockChildren.results[
        blockChildren.results?.findIndex(
          (block) => block.type == 'child_database'
        )
      ] || null
    const queryResponse = await notion.databases.query({
      database_id: database.id,
      sorts: [
        // {
        //   property: 'Name',
        //   direction: 'ascending',
        // },
        // {
        //   property: 'Number',
        //   direction: 'ascending',
        // },
      ],
    })

    const tags = queryResponse.results
      .map((item) => {
        const splited = item.properties?.Tag?.select?.name.split('-')
        const order = parseInt(splited[0].trim())
        const title = splited[1].trim()

        return {
          id: item.properties?.Tag?.select?.id,
          name: item.properties?.Tag?.select?.name,
          title: title,
          order: order,
          databaseId: database.id,
          categoryId: blockId,
          url: generateUrl(title),
        }
      })
      .filter((item) => item?.id !== undefined)
      .filter(
        (item, index, self) =>
          index === self?.findIndex((t) => t.name === item.name)
      )

    return tags
  } catch (error) {
    console.error('[getTags] Notion API Error:', error.message)

    return []
  }
}

const getPosts = async (databaseId, tagName, tagId, categoryId) => {
  try {
    if (!databaseId || !tagName) return []

    const queryResponse = await notion.databases.query({
      database_id: databaseId,
      filter: {
        and: [
          // {
          //   property: 'Publish',
          //   checkbox: {
          //     equals: true,
          //   },
          // },
          {
            property: 'Tag',
            select: {
              equals: tagName,
            },
          },
        ],
      },
      sorts: [
        // {
        //   property: 'Created time',
        //   direction: 'descending',
        // },
        {
          timestamp: 'last_edited_time',
          direction: 'descending',
        },
      ],
    })

    const posts = queryResponse.results.map((item) => ({
      id: item.id,
      title: item.properties?.Name?.title[0]?.plain_text,
      publish: item.properties?.Publish?.checkbox,
      type: item.properties?.Type?.select?.name,
      createdTime: item.created_time,
      url: generateUrl(item.properties?.Name?.title[0].plain_text),
      content: [],
    }))

    return posts
  } catch (error) {
    console.error('[getPosts] Notion API Error:', error.message)

    return []
  }
}

const getContent = async (blockId) => {
  try {
    if (!blockId) return []

    const queryResponse = await notion.blocks.children.list({
      block_id: blockId,
    })

    const content = contentHelper.getContentData(queryResponse)

    content.forEach(async (cnt) => {
      if (
        cnt.type === 'callout' ||
        cnt.type === 'bulleted_list_item' ||
        cnt.type === 'numbered_list_item'
      ) {
        const cntObj = JSON.parse(cnt.data.value)
        if (!cntObj.hasChildren) {
          return false
        }
        const calloutQueryResponse = await notion.blocks.children.list({
          block_id: cnt.id,
        })
        let cntTmp = JSON.parse(cnt.data.value)
        cntTmp.items = contentHelper.getContentData(calloutQueryResponse)
        cnt.data.value = JSON.stringify(cntTmp)
      }
    })

    return content
  } catch (error) {
    console.error('[getContent] Notion API Error:', JSON.stringify(error))

    return []
  }
}

/**
 *
 * @param {string} value Value
 * @returns string
 */
const generateUrl = (value) => {
  let converted = removeVietnameseTones(value)
  converted = _.kebabCase(converted)
  return converted
}

const removeVietnameseTones = (str) => {
  return str
    .normalize('NFD') // Chuyển đổi sang dạng Normalization Form D
    .replace(/[\u0300-\u036f]/g, '') // Loại bỏ các dấu kết hợp (combining diacritical marks)
    .replace(/đ/g, 'd') // Thay thế chữ "đ" thường
    .replace(/Đ/g, 'D') // Thay thế chữ "Đ" hoa
    .replace(/[^a-zA-Z0-9\s]/g, '') // Loại bỏ các ký tự đặc biệt (tuỳ chọn)
}
