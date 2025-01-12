import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setSelectedCategory } from '../redux/slices/category-slice'
import { selectTagsByCategory, setSelectedTag } from '../redux/slices/tag-slice'
import { RootState } from '../redux/store'
import {
  clearFilteredPosts,
  selectPostsByTagAndCategory,
} from '../redux/slices/post-slice'
import { Tag } from '../uxcomic-types'
import { navigate } from 'gatsby'

export const useUxComicData = () => {
  const { list: categories } = useSelector((state: RootState) => state.category)
  const { list: allTags } = useSelector((state: RootState) => state.tag)

  const dispatch = useDispatch()

  const loadTags = (
    categoryId: string,
    selectedTag: Tag | undefined = undefined,
    postUrl?: string
  ) => {
    dispatch(clearFilteredPosts())

    setTimeout(() => {
      const loadedCategory =
        categories.find((category) => category.id === categoryId) || undefined

      dispatch(setSelectedCategory(loadedCategory))
      dispatch(selectTagsByCategory(categoryId))

      const loadedTag = !selectedTag
        ? allTags
            .filter((tag) => tag.categoryId === categoryId)
            .sort((tagA, tagB) => tagA.order - tagB.order)[0]
        : selectedTag

      dispatch(setSelectedTag(loadedTag))
      dispatch(
        selectPostsByTagAndCategory({
          categoryId: categoryId,
          tagId: loadedTag.id,
        })
      )

      let url = `/${loadedCategory?.url}/${loadedTag.url}`
      if (postUrl) url += `/${postUrl}`
      navigate(url)
    }, 150)
  }

  return {
    loadTags,
  }
}
