import { Level } from '../models/level'
import { Post } from '../models/post'
import { PostContent } from '../models/post-content'
import { slugify } from './string-helper'
import PostData from '../../../public/data/posts.json'

const getRelevantPosts = (content: any[]) => {
  const relevantItems = content
    ?.filter((c) => c.type === 'paragraph')
    ?.filter((c) => c?.paragraph?.rich_text?.findIndex((r: any) => r.type === 'mention') > -1)

  const relevantPostTitles = relevantItems.map((r) => r.paragraph.rich_text[0].plain_text)
  const posts = (PostData as any[]).filter((p: any) =>
    relevantPostTitles.includes(p?.properties?.Name?.title?.[0]?.plain_text),
  )

  return { posts: posts.map((p) => convertPost(p)), contentItems: relevantItems }
}

const convertPostContent = (post: any): PostContent => {
  const coverId = getCoverId(post)

  return {
    ...convertPost(post),
    content: post.content.filter((c: any) => c.id !== coverId),
  }
}

const getCoverId = (post: any) => {
  return post.content.find((c: any) => c.type === 'image')?.id || '-1'
}

const convertPost = (post: any): Post => ({
  id: post.id,
  cover: post.content.find((c: any) => c.type === 'image'),
  level: getPostLevelInformation(post?.properties?.Type?.select?.name),
  title: post?.properties?.Name?.title?.[0]?.text?.content || post.properties.title.title[0].plain_text || '',
  slug: slugify(post?.properties?.Name?.title?.[0]?.text?.content),
  createdDate: post.created_time,
  category: post.category,
  tag: post.tag,
})

const getPostLevelInformation = (value: string): Level | undefined => {
  if (!value) return

  const splited = value.split(':')
  return {
    icon: splited[0],
    length: +splited[1],
  }
}

export { convertPost, convertPostContent, getRelevantPosts }
