import React, { useEffect } from 'react'
import Layout from '../components/layout'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import PostSection from '../components/post-section'
import CategorySection from '../components/category-section'
import TagSection from '../components/tag-section'
import { RouteComponentProps, useLocation } from '@reach/router'
import { useUxComicData } from '../hooks/use-uxcomic-data'
import { HeadFC } from 'gatsby'
import CoverImage from '../static/hello.jpg'
import { AboutDialog } from '../components/common'
import AboutSection from '../components/about-section'

interface IUXComicPageProps extends RouteComponentProps {}

const UXComicPage: React.FC<
  React.PropsWithChildren<IUXComicPageProps>
> = () => {
  /**
   * REDUX HOOKS
   */
  const { list: categories } = useSelector((state: RootState) => state.category)
  const { list: tags } = useSelector((state: RootState) => state.tag)
  const { filtered: posts, list: allPosts } = useSelector(
    (state: RootState) => state.post
  )
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
        <div className="flex flex-nowrap items-center">
          <CategorySection />
        </div>

        <div className="flex flex-nowrap space-x-2 mt-3 overflow-x-auto no-scrollbar">
          <TagSection />
        </div>
      </div>

      <div className="grow overflow-hidden">
        <div className="flex items-center justify-center h-full flex-col">
          <PostSection posts={posts} />
        </div>
      </div>

      <AboutSection />
    </Layout>
  )
}

export const Head: HeadFC = () => {
  return (
    <>
      <title>{process.env.GATSBY_HOME_PAGE_TITLE || 'UXcomic'}</title>
      <meta
        property="og:title"
        content={process.env.GATSBY_HOME_PAGE_TITLE || 'UXcomic'}
      />
      <meta
        property="og:description"
        content={
          process.env.GATSBY_HOME_PAGE_DESC ||
          'Tụi mình ở đây để chia sẻ các kiến thức, góc nhìn cá nhân về hành trình làm nghề UX/UI.'
        }
      />
      <meta
        property="og:image"
        content={process.env.GATSBY_WEB_ROOT_URL + CoverImage}
      />
      <meta property="og:type" content="article" />
      <meta property="og:url" content={process.env.GATSBY_WEB_ROOT_URL} />
    </>
  )
}

export default UXComicPage
