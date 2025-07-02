import { Level } from '../models/level'

const getPostInformation = (value: string): Level => {
  const splited = value.split(':')
  return {
    icon: splited[0],
    length: +splited[1],
  }
}

export { getPostInformation }
