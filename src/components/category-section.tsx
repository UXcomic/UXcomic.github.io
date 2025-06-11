import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { useUxComicData } from '../hooks/use-uxcomic-data'
import { Button } from '@headlessui/react'
import {
  XMarkIcon,
  CheckIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/solid'
import { UxComicDrawer } from './common'

interface ICategorySectionProps {}

const CategorySection: React.FC<
  React.PropsWithChildren<ICategorySectionProps>
> = () => {
  const [open, setOpen] = useState<boolean>(false)

  const { loadTags } = useUxComicData()

  const { list: categories, selected: selectedCategory } = useSelector(
    (state: RootState) => state.category
  )

  const handleLoadTags = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.currentTarget.id === selectedCategory?.id) return
    loadTags(event.currentTarget.id)
    setOpen(false)
  }

  return (
    <>
      <div
        className="flex justify-center items-center cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <label className="flex items-center justify-center w-8 h-8 text-[22px]">
          {selectedCategory?.icon}
        </label>
        <h1 className="ml-2 title-1">{selectedCategory?.title}</h1>
        <ChevronDownIcon className="size-5 ml-2" />
      </div>
      <UxComicDrawer open={open} setOpen={setOpen}>
        <>
          <div className="flex items-center justify-between h-16">
            <h1 className="title-1">Danh mục</h1>
            <Button
              className="flex items-center justify-center bg-white bg-opacity-75 border-2 border-white rounded-full w-12 h-12"
              onClick={() => setOpen(false)}
            >
              <XMarkIcon className="w-6 h-6" />
            </Button>
          </div>
          {categories.map((category) => (
            <div
              key={category.id}
              id={category.id}
              className="flex place-items-center h-16"
              onClick={handleLoadTags}
            >
              <label className="flex items-center justify-center w-[22px] h-7 text-[22px]">
                {category?.icon}
              </label>
              <div className="grow ml-3">
                <h1 className="flex items-center justify-between my-5">
                  {category.title}
                  {category.id === selectedCategory?.id && (
                    <CheckIcon className="w-6 h-6" />
                  )}
                </h1>
                <div className="bg-uxcomic-divider h-[0.5px]"></div>
              </div>
            </div>
          ))}
        </>
      </UxComicDrawer>
    </>
  )
}

export default CategorySection
