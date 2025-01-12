import React from 'react'
import { Button } from '@headlessui/react'
import { RootState } from '../redux/store'
import { useDispatch, useSelector } from 'react-redux'
import {
  clearFilteredPosts,
  selectPostsByTagAndCategory,
} from '../redux/slices/post-slice'
import { setSelectedTag } from '../redux/slices/tag-slice'
import { navigate } from 'gatsby'

interface ITagSectionProps {}

const TagSection: React.FC<
  React.PropsWithChildren<ITagSectionProps>
> = ({}) => {
  const { selected: selectedCategory } = useSelector(
    (state: RootState) => state.category
  )

  const {
    filtered: tags,
    selected: selectedTag,
    list: allTags,
  } = useSelector((state: RootState) => state.tag)

  const dispatch = useDispatch()

  const handleLoadPosts = (event: React.MouseEvent<HTMLButtonElement>) => {
    const tagId = event.currentTarget.id

    if (!selectedCategory || tagId == selectedTag?.id) return

    dispatch(clearFilteredPosts())

    setTimeout(() => {
      const selectedTag = allTags.find(
        (tag) => tag.categoryId === selectedCategory.id && tag.id === tagId
      )

      dispatch(setSelectedTag(selectedTag))
      dispatch(
        selectPostsByTagAndCategory({
          categoryId: selectedCategory.id,
          tagId: tagId,
        })
      )
      navigate(`/${selectedCategory.url}/${selectedTag?.url}`)
    }, 150)
  }

  return (
    <>
      {[...tags]
        .sort((tagA, tagB) => tagA.order - tagB.order)
        .map((tag) => (
          <Button
            key={tag.id} // Dùng tag.id làm key duy nhất
            id={tag.id}
            onClick={handleLoadPosts}
            className={`inline-flex items-center justify-center h-9 border border-solid border-black rounded-[8px] py-2 px-3 font-variation-semibold ${
              tag.id === selectedTag?.id ? '' : 'opacity-20'
            }`}
          >
            {tag.title}
          </Button>
        ))}
    </>
  )
}

export default TagSection
