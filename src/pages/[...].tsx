import React, { useEffect } from 'react'
import Layout from '../components/layout'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import PostSection from '../components/post-section'
import CategorySection from '../components/category-section'
import TagSection from '../components/tag-section'
import { RouteComponentProps, useLocation } from '@reach/router'
import { useUxComicData } from '../hooks/use-uxcomic-data'

interface IUXComicPageProps extends RouteComponentProps {
  categoryUrl?: string
  tagUrl?: string
  postUrl?: string
}

const UXComicPage: React.FC<React.PropsWithChildren<IUXComicPageProps>> = ({
  categoryUrl,
  tagUrl,
  postUrl,
}) => {
  /**
   * REDUX HOOKS
   */
  const { list: categories } = useSelector((state: RootState) => state.category)
  const { list: tags } = useSelector((state: RootState) => state.tag)
  const { filtered: posts, list: allPosts } = useSelector(
    (state: RootState) => state.post
  )
  const isGrid = useSelector((state: RootState) => state.listMode.isGrid)

  const { loadTags } = useUxComicData()

  const location = useLocation()

  /**
   * USEEFFECTS
   */
  useEffect(() => {
    if (!categories.length) return

    const pathSegments = location.pathname.split('/').filter(Boolean)
    let categoryUrlName = pathSegments[0] || categories[0].id
    let tagUrlName = pathSegments[1]
    let postUrlName = pathSegments[2]

    if (pathSegments.length === 1) {
      const loadedPost = allPosts.find(
        (post) => post.id.replace(/-/g, '') === pathSegments[0]
      )
      categoryUrlName =
        categories.find((category) => category.id === loadedPost?.categoryId)
          ?.url || ''
      tagUrlName =
        tags.find(
          (tag) =>
            tag.categoryId === loadedPost?.categoryId &&
            tag.id === loadedPost?.tagId
        )?.url || ''
      postUrlName = loadedPost?.url || ''
    } else {
      categoryUrlName = pathSegments[0] || categories[0].id
      tagUrlName = pathSegments[1]
      postUrlName = pathSegments[2]
    }

    const categoryId = categories.find(
      (category) => category.url === categoryUrlName
    )?.id

    const loadedTag = tags.find(
      (tag) => tag.categoryId === categoryId && tag.url === tagUrlName
    )

    if (!categoryId || !loadedTag) {
      loadTags(categories[0].id)
      return
    }

    loadTags(categoryId, loadedTag, postUrlName)
  }, [categories])

  /**
   * HANDLERS
   */
  return (
    <Layout>
      <div className="pl-6 py-2">
        {/** CATEGORY SECTION */}
        <div className="flex flex-nowrap items-center">
          <CategorySection />
        </div>

        {/** TAG SECTION */}
        <div className="flex flex-nowrap space-x-2 mt-3 overflow-x-auto no-scrollbar">
          <TagSection />
        </div>
      </div>

      <div className="grow overflow-hidden">
        {/** POST SECTION */}
        <div className="flex items-center justify-center h-full flex-col">
          <PostSection posts={posts} />
        </div>
      </div>

      {/** FOOTER SECTION */}
      <div className="h-11 pt-1">
        <p className="font-uxcomic-manrope-regular text-center text-uxcomic-footer">
          <span className="text-uxcomic-text-tertiary">Built with</span>
          <span> ❤️ </span>
          <span className="text-uxcomic-text-tertiary"> by </span>
          <b className="text-uxcomic-text-tertiary underline underline-offset-1">
            UXcomic
          </b>
        </p>
      </div>
    </Layout>
  )
}

// export const Head: HeadFC = ({ location, params, data, pageContext }) => {
//   return (
//     <>
//       <title>UXComic</title>
//       <meta property="og:title" content="UXcomic" />
//       <meta property="og:description" content="UXcomic" />
//       <meta
//         property="og:image"
//         content="https://prod-files-secure.s3.us-west-2.amazonaws.com/bbbed9fd-0db9-45f7-8f82-bd0944c25a2d/df9019ef-3650-4c5e-8d06-815ff268d5d8/Lets_your_work_speak_themselves_be_like.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240923%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240923T093734Z&X-Amz-Expires=3600&X-Amz-Signature=d0687184912fa7b743510e718e7b60034c8c9a45d46aa7375de8f47d783d3ad0&X-Amz-SignedHeaders=host&x-id=GetObject"
//       />
//       <meta property="og:type" content="article" />
//       <meta
//         property="og:url"
//         content={`https://deploy-preview-2--hungvuongg71.netlify.app/`}
//       />
//     </>
//   )
// }

export default UXComicPage
