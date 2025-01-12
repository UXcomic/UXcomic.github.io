import React from 'react'
import { Content } from '../../uxcomic-types'
import parse from 'html-react-parser'

interface INotionH1Props {
  content: Content
}

const NotionH3: React.FC<React.PropsWithChildren<INotionH1Props>> = ({
  content,
  children,
}) => {
  return (
    <h3 key={content.id} className="notion-h3">
      {parse(content.data.value as string)}
    </h3>
  )
}

export default NotionH3
