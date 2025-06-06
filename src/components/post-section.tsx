import React, { useEffect, useState } from 'react'
import { UxComicCard, UxComicDialog } from './common'
import { renderContent } from '../helpers/content-helper'
import { Post } from '../uxcomic-types'
import {
  ArrowUpOnSquareIcon,
  HandThumbDownIcon,
  HandThumbUpIcon,
} from '@heroicons/react/24/outline'
import {
  HandThumbUpIcon as HandThumbUpSolidIcon,
  HandThumbDownIcon as HandThumbDownSolidIcon,
} from '@heroicons/react/24/solid'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { useLocation } from '@reach/router'
import { navigate } from 'gatsby'

interface IPostSectionProps {
  posts: Post[]
}

const PostSection: React.FC<React.PropsWithChildren<IPostSectionProps>> = ({
  posts,
}) => {
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [liked, setLiked] = useState<boolean>(false)
  const [unliked, setUnliked] = useState<boolean>(false)
  const [selectedPost, setSelectedPost] = useState<Post>()

  const { selected: selectedCategory } = useSelector(
    (state: RootState) => state.category
  )
  const { selected: selectedTag } = useSelector((state: RootState) => state.tag)
  const { list: allPosts } = useSelector((state: RootState) => state.post)

  // const dispatch = useDispatch()

  const isGrid = useSelector((state: RootState) => state.listMode.isGrid)

  // const { props, bind, trans, enableDrag, undoFlashCard } =
  //   useUxComicFlashCard(posts)

  const location = useLocation()

  useEffect(() => {
    if (!location || !posts.length) return

    const pathSegments = location.pathname.split('/').filter(Boolean)
    const postUrlName = pathSegments[2]

    const postParam = posts.find((post) => post.url == postUrlName)

    if (!postParam || selectedPost) return

    setSelectedPost(postParam)
    setOpenDialog(true)
  }, [location, selectedPost, posts])

  const handleLoadContent = (event: React.MouseEvent<HTMLDivElement>) => {
    const postId = event.currentTarget.id
    const loadedPost = posts.find((post) => post.id === postId)
    setSelectedPost(loadedPost)

    const newPath = `/${selectedCategory?.url}/${selectedTag?.url}/${loadedPost?.url}`
    setOpenDialog(true)

    ;(window as any).gtag('event', 'page_view', {
      page_path: newPath,
      page_location: window.location.href,
      page_title: document.title,
    })

    navigate(newPath)
  }

  const handleShareLink = () => {
    if (!selectedPost) return

    if (navigator.share) {
      const pathSegments = location.pathname.split('/').filter(Boolean)

      navigator
        .share({
          title: selectedPost.title,
          text: '',
          url: `${process.env.GATSBY_WEB_ROOT_URL}/bai-viet/${pathSegments[0]}/${pathSegments[1]}/${pathSegments[2]}/`, // URL của bài viết
        })
        .then(() => console.log('Chia sẻ thành công!'))
        .catch((error) => console.error('Lỗi khi chia sẻ:', error))
    } else {
      console.log('Trình duyệt không hỗ trợ Web Share API')
    }
  }

  const handleLikePost = (value: boolean) => {
    setLiked(value)
    setUnliked(!value)
  }

  const handleCloseCallback = () => {
    navigate(`/${selectedCategory?.url}/${selectedTag?.url}`)
  }

  return (
    <>
      {isGrid && (
        <div className="grid grid-cols-2 grid-flow-row auto-rows-max auto-cols-max gap-4 items-start h-full py-4 px-2 overflow-x-hidden overflow-y-scroll no-scrollbar">
          {posts.map((post) => (
            <UxComicCard
              key={post.id}
              post={post}
              onClick={handleLoadContent}
            ></UxComicCard>
          ))}
        </div>
      )}

      {selectedPost && (
        <UxComicDialog
          open={openDialog}
          setOpen={setOpenDialog}
          closeCallback={handleCloseCallback}
        >
          <>
            <div className="flex items-center justify-center w-full">
              <UxComicCard
                post={selectedPost}
                style={{
                  transform: 'rotate(4deg) scale(0.8)',
                  width: '180px',
                }}
              ></UxComicCard>
            </div>
            <h1 className="notion-h1 mt-6 mb-1 text-center">
              {selectedPost.title}
            </h1>
            <p className="caption text-center mb-4">
              {new Intl.DateTimeFormat('en-US', {
                month: 'long', // Tên tháng đầy đủ
                day: 'numeric', // Số ngày
                year: 'numeric', // Số năm
              }).format(new Date(selectedPost.createdTime))}
            </p>
            {selectedPost?.content
              ?.filter(
                (cnt) =>
                  !cnt.data.value.includes(
                    process.env.GATSBY_NOTION_URL as string
                  )
              )
              ?.map((content) => renderContent(content, allPosts))}
            {/* RELEVANT ITEM */}
            <div className="flex flex-nowrap items-start justify-start overflow-x-auto no-scrollbar mx-[-16px] pb-2 relevant-item">
              {selectedPost?.content
                ?.filter((cnt) =>
                  cnt.data.value.includes(
                    process.env.GATSBY_NOTION_URL as string
                  )
                )
                ?.map((content) => renderContent(content, allPosts))}
            </div>
            <div className="w-full h-12 fixed left-0 bottom-3 flex justify-between items-center">
              <div className="flex justify-between items-center w-60 h-12 mx-auto px-7 rounded-full border-2 border-solid border-white bg-white backdrop-blur-lg bg-opacity-75">
                {!liked && (
                  <HandThumbUpIcon
                    className="w-6 h-6"
                    onClick={() => handleLikePost(true)}
                  />
                )}
                {liked && (
                  <HandThumbUpSolidIcon
                    className="w-6 h-6"
                    onClick={() => handleLikePost(false)}
                  />
                )}
                <ArrowUpOnSquareIcon
                  className="w-6 h-6 active:opacity-50"
                  onClick={handleShareLink}
                />
                {!unliked && (
                  <HandThumbDownIcon
                    className="w-6 h-6"
                    onClick={() => handleLikePost(false)}
                  />
                )}
                {unliked && (
                  <HandThumbDownSolidIcon
                    className="w-6 h-6"
                    onClick={() => handleLikePost(true)}
                  />
                )}
              </div>
            </div>
          </>
        </UxComicDialog>
      )}
    </>
  )
}

export default PostSection
