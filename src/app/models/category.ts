import { Base } from './base'
import { Tag } from './tag'

export interface Category extends Base {
  name: string
  slug?: string
  icon: string
  order?: number
  tags?: Tag[]
}
