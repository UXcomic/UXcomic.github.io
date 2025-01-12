import axios from 'axios'
import { Content } from '../uxcomic-types'

export const UxComicService = {
  async getContent(blockId: string): Promise<Content[]> {
    try {
      const {
        data: { data },
      } = await axios.get(`/.netlify/functions/content?blockId=${blockId}`)
      return data
    } catch (error) {
      throw error
    }
  },
}
