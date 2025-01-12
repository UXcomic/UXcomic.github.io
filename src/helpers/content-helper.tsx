import React, { JSX } from 'react'
import {
  NotionBulletedListItem,
  NotionCallOut,
  NotionDivider,
  NotionH1,
  NotionH2,
  NotionH3,
  NotionImage,
  NotionNumberedListItem,
  NotionParagraph,
  NotionVideo,
} from '../components/notion-elements'
import { Content, Post } from '../uxcomic-types'
import parse, { Element } from 'html-react-parser'
import { UxComicCard } from '../components/common'

interface IRenderContent {
  content: Content
  allPosts: Post[]
}

let tmpNumbered = 1

export const renderContent = (
  content: Content,
  allPosts: Post[]
): JSX.Element | null => {
  tmpNumbered = content.type === 'numbered_list_item' ? tmpNumbered + 1 : 0
  switch (content.type) {
    case 'heading_1':
      return <NotionH1 key={content.id} content={content}></NotionH1>
    case 'heading_2':
      return <NotionH2 key={content.id} content={content}></NotionH2>
    case 'heading_3':
      return <NotionH3 key={content.id} content={content}></NotionH3>
    case 'callout':
      return <NotionCallOut key={content.id} content={content}></NotionCallOut>
    case 'bulleted_list_item':
      return (
        <NotionBulletedListItem
          key={content.id}
          content={content}
        ></NotionBulletedListItem>
      )
    case 'numbered_list_item':
      return (
        <NotionNumberedListItem
          key={content.id}
          index={tmpNumbered}
          content={content}
        ></NotionNumberedListItem>
      )
    case 'image':
      return <NotionImage key={content.id} content={content}></NotionImage>
    case 'paragraph':
      if (
        allPosts?.length &&
        content.data.value.includes(process.env.GATSBY_NOTION_URL as string)
      ) {
        const url = getHrefFromHtml(content.data.value)
        const postUrlId = url.pathname.split('/')[1]
        const post = allPosts.find(
          (tmp) => tmp.id.replace(/-/g, '') === postUrlId
        )
        if (post)
          return (
            <UxComicCard
              key={postUrlId}
              post={post}
              onClick={() => (window.location.href = `/${postUrlId}`)}
            ></UxComicCard>
          )
      }

      return (
        <NotionParagraph key={content.id} content={content}></NotionParagraph>
      )
    case 'divider':
      return <NotionDivider key={content.id} content={content}></NotionDivider>
    case 'video':
      return <NotionVideo key={content.id} content={content}></NotionVideo>
  }
  return null
}

const getHrefFromHtml = (html: string) => {
  let url = ''

  parse(html, {
    replace: (domNode) => {
      const element = domNode as Element
      if (element.name === 'a' && element.attribs?.href) {
        url = element.attribs.href
      }
    },
  })
  return new URL(url)
}
