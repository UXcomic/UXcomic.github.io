import React from 'react'
import { Content } from '../../uxcomic-types'

interface INotionDividerProps {
  content: Content
}

const NotionDivider: React.FC<React.PropsWithChildren<INotionDividerProps>> = ({
  content,
  children,
}) => {
  return <div key={content.id} className="notion-divider"></div>
}

export default NotionDivider
