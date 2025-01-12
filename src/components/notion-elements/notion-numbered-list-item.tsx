import React, { useEffect, useState } from 'react'
import { Content, NumberedListItem } from '../../uxcomic-types'
import parse from 'html-react-parser'
import { renderContent } from '../../helpers/content-helper'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'

interface INotionNumberedListItemProps {
  index: number
  content: Content
}

const NotionNumberedListItem: React.FC<
  React.PropsWithChildren<INotionNumberedListItemProps>
> = ({ index, content, children }) => {
  const [numberedListItem, setNumberedListItem] = useState<NumberedListItem>()

  const { list: allPosts } = useSelector((state: RootState) => state.post)

  useEffect(() => {
    if (!content) return

    let tmpParse
    try {
      tmpParse = JSON.parse(content.data.value) as NumberedListItem
    } catch (e) {
      tmpParse = content.data.value
    }

    let tmp = tmpParse as NumberedListItem
    if (tmp.hasChildren)
      tmp.items.forEach(
        (item) =>
          (item.data.value =
            item.type === 'bulleted_list_item' ||
            item.type === 'numbered_list_item'
              ? JSON.parse(item.data.value)
              : item.data.value)
      )

    setNumberedListItem(tmp as NumberedListItem)
  }, [content])

  return (
    numberedListItem && (
      <>
        <div
          key={content.id}
          id={content.id}
          className="flex flex-initial mb-2 notion-numbered"
        >
          <span>{index}.</span>
          <span className="block ml-3">
            {parse(numberedListItem.content as string)}
          </span>
        </div>
        {numberedListItem.items.map((child) =>
          child.type === 'bulleted_list_item' ? (
            <p
              key={child.id}
              id={child.id}
              className="flex flex-initial mb-2 ml-6"
            >
              <span className="inline-block flex-shrink-0 w-[0.4rem] h-[0.4rem] bg-black rounded-full mt-[0.6rem]"></span>
              <span className="block ml-3">
                {parse((child.data.value as any).content)}
              </span>
            </p>
          ) : (
            renderContent(child, allPosts)
          )
        )}
      </>
    )
  )
}

export default NotionNumberedListItem
