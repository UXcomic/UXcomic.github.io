import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../redux/store'
import { useNotionPosts } from '../../hooks'
import { setTags } from '../../redux/slices/tag-slice'

const TagManager: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const posts = useNotionPosts()

  useEffect(() => {
    if (posts.length) {
      const tags = getUniqueTags()
      dispatch(setTags(tags))
    }
  }, [posts, dispatch])

  const getUniqueTags = () => {
    const tags = posts
      .filter(({ post }) => post.id !== process.env.GATSBY_INTRO_PAGE_ID)
      .map(({ post }) => post.tag)
      .filter(
        (tag, index, self) =>
          index ===
          self.findIndex(
            (t) =>
              t.title === tag.title &&
              t.categoryId === tag.categoryId &&
              t.databaseId === tag.databaseId
          )
      )
    return tags
  }

  return null
}

export default TagManager
