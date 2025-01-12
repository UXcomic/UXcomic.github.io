export interface Category {
  id: string
  title: string
  icon: string
  url: string
}

export interface Tag {
  id: string
  name: string
  title: string
  order: number
  url: string
  databaseId: string
  categoryId: string
}

export interface Post {
  id: string
  title: string
  cover: string
  publish: string
  createdTime: string
  type: string
  tagId: string
  categoryId: string
  url: string
  content?: Content[]
}

export interface Content {
  id: string
  type:
    | 'heading_1'
    | 'heading_2'
    | 'heading_3'
    | 'callout'
    | 'paragraph'
    | 'image'
    | 'bulleted_list_item'
    | 'numbered_list_item'
    | 'callout'
    | 'divider'
    | 'video'
  data: ContentData
}

export interface ContentData {
  value: string
  caption: string
}

export interface Callout {
  title: string
  icon: string
  items: Content[]
}

export interface BulletedListItem {
  content: string
  hasChildren: boolean
  items: Content[]
}

export interface NumberedListItem {
  content: string
  hasChildren: boolean
  items: Content[]
}

export interface NotionPostQuery {
  post: {
    id: string
    title: string
    cover: string
    publish: string
    type: string
    createdTime: string
    url: string
    category: Category
    tag: Tag
    content?: Content[]
  }
}
