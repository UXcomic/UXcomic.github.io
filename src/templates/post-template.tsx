import { useLocation } from '@reach/router'
import { HeadFC, navigate, PageProps } from 'gatsby'
import React, { useEffect } from 'react'

interface IPostProps extends PageProps {}

interface PageContext {
  id: string
  title: string
  description: string
  cover: string
  tagId: string
  categoryId: string
}

const PostTemplate: React.FC<React.PropsWithChildren<IPostProps>> = () => {
  const location = useLocation()

  useEffect(() => {
    setTimeout(redirectToPostDetail, 1000)
  }, [])

  const redirectToPostDetail = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean)

    const categoryUrlName = pathSegments[1]
    const tagUrlName = pathSegments[2]
    const postUrlName = pathSegments[3]

    navigate(`/${categoryUrlName}/${tagUrlName}/${postUrlName}`)
  }

  return (
    <div className="flex items-center justify-center">
      <h1>Loading...</h1>
    </div>
  )
}

export const Head: HeadFC = ({ pageContext }) => {
  const { title, description, cover } = pageContext as PageContext

  const location = useLocation()

  const getUrl = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean)

    const categoryUrlName = pathSegments[1]
    const tagUrlName = pathSegments[2]
    const postUrlName = pathSegments[3]

    return `${process.env.GATSBY_WEB_ROOT_URL}/bai-viet/${categoryUrlName}/${tagUrlName}/${postUrlName}`
  }

  return (
    <>
      <title>{title || 'Home Page'}</title>
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={cover} />
      <meta property="og:type" content="article" />
      <meta property="og:url" content={getUrl()} />
    </>
  )
}

export default PostTemplate
