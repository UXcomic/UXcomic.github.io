import { Base } from './base'
import { Level } from './level'

export interface Post extends Base {
  cover: string
  title: string
  level: Level
}
