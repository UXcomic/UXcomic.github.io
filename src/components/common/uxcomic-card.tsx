import React, { useState } from 'react'
import { Post } from '../../uxcomic-types'

interface IUxComicCardProps {
  post: Post
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void
  style?: React.CSSProperties
}

const UxComicCard: React.FC<React.PropsWithChildren<IUxComicCardProps>> = ({
  post,
  onClick,
  style,
}) => {
  return (
    <div
      key={post.id}
      id={post.id}
      className="w-[160px] flex-none flex-col p-1 bg-white rounded-md uxcomic-card shadow-[0px_1px_3px_0px_rgba(0,0,0,0.15),0px_1px_2px_0px_rgba(0,0,0,0.3)]"
      onClick={onClick}
      style={style}
    >
      <div className="border border-solid border-uxcomic-divider rounded-sm">
        <div
          className="grow bg-cover bg-center h-40"
          style={{
            backgroundImage: `url(${post.cover})`,
          }}
        ></div>
        <div className="card-title-medium h-14 text-center border-t-[1px] pt-4 pb-2 px-2 relative flex flex-col items-center justify-center">
          <div className="border border-solid border-x-uxcomic-divider rounded-full px-1 py-1 absolute top-[-11px] bg-white flex items-center">
            {Array.from({ length: 3 }, (_, index) => (
              <span
                key={`tag_type_${index}_${post.id}`}
                className={`inline-block text-[12px] mx-[0.5px] leading-none ${parseInt(post.type?.split(':')[1] as string) >= index + 1 ? '' : 'opacity-30'}`}
              >
                {post.type?.split(':')[0]}
              </span>
            ))}
          </div>
          <span className="inline-block w-full ultility-truncate card-title-small">
            {post.title}
          </span>
        </div>
      </div>
    </div>
  )
}

export default UxComicCard
