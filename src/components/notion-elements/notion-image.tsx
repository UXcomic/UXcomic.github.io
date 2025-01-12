import React from 'react'
import { Content } from '../../uxcomic-types'
import parse from 'html-react-parser'

interface INotionImageProps {
  content: Content
}

const NotionImage: React.FC<React.PropsWithChildren<INotionImageProps>> = ({
  content,
  children,
}) => {
  return (
    <>
      <img
        src={content.data.value as string}
        alt={content.type}
        className="rounded-lg my-2"
      ></img>
      {content.data.caption && (
        <div className="caption">{parse(content.data.caption)}</div>
      )}
    </>
  )
}

export default NotionImage
