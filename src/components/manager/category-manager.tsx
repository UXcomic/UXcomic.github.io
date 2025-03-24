import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setCategories } from '../../redux/slices/category-slice'
import { AppDispatch } from '../../redux/store'
import { useNotionPosts } from '../../hooks'

const CategoryManager: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const posts = useNotionPosts()

  useEffect(() => {
    if (posts.length) {
      const categories = getUniqueCategories()
      dispatch(setCategories(categories))
    }
  }, [posts, dispatch])

  const getUniqueCategories = () => {
    const categories = posts
      .filter(({ post }) => post.id !== process.env.GATSBY_INTRO_PAGE_ID)
      .map(({ post }) => post.category)
      .filter(
        (category, index, self) =>
          index === self.findIndex((cate) => cate.id === category.id)
      )
    return categories
  }

  return null
}

export default CategoryManager
