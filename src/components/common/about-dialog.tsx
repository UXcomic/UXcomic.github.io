import React, { useEffect, useState } from 'react'
import UxComicDialog from './uxcomic-dialog'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { Post } from '../../uxcomic-types'
import { renderContent } from '../../helpers/content-helper'

interface IAboutDialogProps {
  openDialog: boolean
  onOpenDialog: (value: boolean) => void
}

const AboutDialog: React.FC<React.PropsWithChildren<IAboutDialogProps>> = ({
  openDialog,
  onOpenDialog,
}) => {
  const { list: allPosts } = useSelector((state: RootState) => state.post)
  const [aboutPost, setAboutPost] = useState<Post>()

  useEffect(() => {
    if (!allPosts.length) return

    setAboutPost(
      allPosts.find((post) => post.id === process.env.GATSBY_INTRO_PAGE_ID)
    )
  }, [allPosts])

  return (
    <UxComicDialog open={openDialog} setOpen={onOpenDialog}>
      {aboutPost && (
        <>
          <h1 className="flex items-center justify-between my-5 title-1">
            {aboutPost.title}
          </h1>
          <img src={aboutPost.cover} alt={aboutPost.title} />
          {aboutPost.content?.map((content) =>
            renderContent(content, allPosts)
          )}
        </>
      )}
    </UxComicDialog>
  )
}

export default AboutDialog
