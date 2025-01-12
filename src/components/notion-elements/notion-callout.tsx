import React, { useEffect, useState } from 'react'
import { Callout, Content } from '../../uxcomic-types'
import parse from 'html-react-parser'
import { renderContent } from '../../helpers/content-helper'

interface INotionCallOutProps {
  content: Content
}

const NotionCallOut: React.FC<React.PropsWithChildren<INotionCallOutProps>> = ({
  content,
  children,
}) => {
  const [callout, setCallout] = useState<Callout>()

  useEffect(() => {
    setCallout(JSON.parse(content.data.value) as Callout)
  }, [content])

  return (
    <div
      key={content.id}
      id={content.id}
      className="flex flex-initial bg-white rounded-lg bg-opacity-75 border-2 border-solid border-white p-3 my-2 notion-callout"
    >
      {callout && (
        <>
          <span>{callout.icon}</span>
          <div className="ml-2">
            {callout?.title && (
              <p className="notion-body">{parse(callout.title)}</p>
            )}
            {callout.items.map((cnt) => renderContent(cnt))}
          </div>
        </>
      )}
    </div>
  )
}

export default NotionCallOut
