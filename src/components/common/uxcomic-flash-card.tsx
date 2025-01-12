import { animated, to as interpolate, useSpring } from '@react-spring/web'
import React, { useEffect, useState } from 'react'
import { SpringValue } from '@react-spring/core/dist/react-spring_core.modern.js'
import { ReactDOMAttributes } from '@use-gesture/react/dist/declarations/src/types'

interface IFlashCardProps {
  id?: string
  title?: string
  imageUrl?: string
  type?: string
  i: number
  x: SpringValue<number>
  y: SpringValue<number>
  rot: SpringValue<number>
  scale: SpringValue<number>
  trans: (r: number, s: number) => string
  bind: (...args: any[]) => ReactDOMAttributes
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void
  onEnableDrag?: (isEnabled: boolean) => void
}

const UxComicFlashCard: React.FC<React.PropsWithChildren<IFlashCardProps>> = ({
  id,
  title,
  imageUrl,
  type,
  i,
  x,
  y,
  rot,
  scale,
  trans,
  bind,
  onClick,
  onEnableDrag,
}) => {
  console.log(type)

  return (
    <>
      <animated.div
        className="flex flex-col deck"
        key={i}
        style={{
          x,
          y,
          width: '272px',
          height: 'auto',
          padding: 0,
        }}
      >
        <animated.div
          {...bind(i)}
          id={id}
          className="flex flex-col justify-center uxcomic-card p-2"
          style={{
            transform: interpolate([rot, scale], trans),
            touchAction: 'pan-y',
            margin: '0 auto',
            width: '272px',
            height: '356px',
          }}
          onClick={onClick}
        >
          <div className="flex flex-col h-full border border-solid border-uxcomic-divider overflow-hidden rounded-lg">
            <div
              className="grow bg-cover bg-center rounded-t-lg"
              style={{
                width: '100%',
                height: '280px',
                backgroundImage: `url(${imageUrl})`,
              }}
            ></div>
            <div className="flex flex-col h-14 pt-4 pb-2 px-2 items-center justify-center border-t card-title-medium text-center bg-white relative">
              <div className="border border-solid border-x-uxcomic-divider rounded-full px-2 absolute top-[-14px] bg-white">
                {Array.from({ length: 3 }, (_, index) => (
                  <span
                    key={`tag_type_${index}_${id}`}
                    className={`inline-block w-6 h-6 ${parseInt(type?.split(':')[1] as string) >= index + 1 ? '' : 'opacity-30'}`}
                  >
                    {type?.split(':')[0]}
                  </span>
                ))}
              </div>
              {title}
            </div>
          </div>
        </animated.div>
        {/* <animated.div style={{ ...contentStyles }}>
          <h1 className="notion-h1 mt-6 mb-4 text-center">{title}</h1>
          {children}
          <div className="flex justify-between items-center w-60 h-12 mx-auto mt-6 px-7 rounded-full border-2 border-solid border-white bg-white backdrop-blur-lg bg-opacity-75 utility-sticky bottom-6">
            {!liked && (
              <HandThumbUpIcon
                className="w-6 h-6"
                onClick={() => setLiked(true)}
              />
            )}
            {liked && (
              <HandThumbUpSolidIcon
                className="w-6 h-6"
                onClick={() => setLiked(false)}
              />
            )}
            <ArrowUpOnSquareIcon
              className="w-6 h-6 active:opacity-50"
              onClick={handleShareLink}
            />
            {!unliked && (
              <HandThumbDownIcon
                className="w-6 h-6"
                onClick={() => setUnliked(true)}
              />
            )}
            {unliked && (
              <HandThumbDownSolidIcon
                className="w-6 h-6"
                onClick={() => setUnliked(false)}
              />
            )}
          </div>
        </animated.div> */}
      </animated.div>
    </>
  )
}

export default UxComicFlashCard
