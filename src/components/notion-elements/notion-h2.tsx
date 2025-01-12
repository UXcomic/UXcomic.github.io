import React from 'react'
import { Content } from '../../uxcomic-types'
import parse from 'html-react-parser'

interface INotionH1Props {
  content: Content
}

const NotionH2: React.FC<React.PropsWithChildren<INotionH1Props>> = ({
  content,
  children,
}) => {
  return (
    <h2 key={content.id} className="notion-h2">
      {parse(content.data.value as string)}
    </h2>
  )
}

export default NotionH2
