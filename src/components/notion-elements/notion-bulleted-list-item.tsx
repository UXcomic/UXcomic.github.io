import React, { useEffect, useState } from 'react'
import { BulletedListItem, Content } from '../../uxcomic-types'
import parse from 'html-react-parser'
import { renderContent } from '../../helpers/content-helper'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'

interface INotionBulletedListItemProps {
  content: Content
}

const NotionBulletedListItem: React.FC<
  React.PropsWithChildren<INotionBulletedListItemProps>
> = ({ content, children }) => {
  const [bulletedListItem, setBulletedListItem] = useState<BulletedListItem>()

  const { list: allPosts } = useSelector((state: RootState) => state.post)

  useEffect(() => {
    if (!content) return

    let tmpParse
    try {
      tmpParse = JSON.parse(content.data.value) as BulletedListItem
    } catch (e) {
      tmpParse = content.data.value
    }

    let tmp = tmpParse as BulletedListItem
    if (tmp.hasChildren)
      tmp.items.forEach(
        (item) =>
          (item.data.value =
            item.type === 'bulleted_list_item' ||
            item.type === 'numbered_list_item'
              ? JSON.parse(item.data.value)
              : item.data.value)
      )

    setBulletedListItem(tmp)
  }, [content])

  return (
    bulletedListItem && (
      <>
        <div
          key={content.id}
          id={content.id}
          className="flex flex-initial mb-2 notion-bulleted"
        >
          <span className="inline-block flex-shrink-0 w-[0.4rem] h-[0.4rem] bg-black rounded-full mt-[0.6rem]"></span>
          <span className="block ml-3 ultility-break-words">
            {parse(bulletedListItem.content as string)}
          </span>
        </div>
        {bulletedListItem.items.map((child) =>
          child.type === 'bulleted_list_item' ? (
            <div
              key={child.id}
              id={child.id}
              className="flex flex-initial mb-2 ml-6"
            >
              <span className="inline-block flex-shrink-0 w-[0.4rem] h-[0.4rem] border-[1px] border-black rounded-full mt-[0.6rem]"></span>
              <span className="block ml-3">
                {parse((child.data.value as any).content)}
              </span>
            </div>
          ) : (
            renderContent(child, allPosts)
          )
        )}
      </>
    )
  )
}

export default NotionBulletedListItem
