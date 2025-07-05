import { Base } from './base'
import { Category } from './category'
import { Level } from './level'
import { Tag } from './tag'

export interface Post extends Base {
  cover: string
  title: string
  level?: Level
  slug: string
  createdDate?: Date
  category?: Category
  tag?: Tag
}
