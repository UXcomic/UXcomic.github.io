import { Base } from './base'

export interface Tag extends Base {
  name: string
  slug: string
  order: number
}
