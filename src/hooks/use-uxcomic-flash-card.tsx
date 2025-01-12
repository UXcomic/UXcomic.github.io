import { useSprings } from '@react-spring/web'
import { useState } from 'react'
import { from, to, trans } from '../helpers/flash-card-helper'
import { useDrag } from '@use-gesture/react'
import { Post } from '../uxcomic-types'

export const useUxComicFlashCard = (posts: Post[]) => {
  const [isDraggingAllowed, setIsDraggingAllowed] = useState<boolean>(true)
  const [gone] = useState(() => new Set()) // The set flags all the cards that are flicked out

  // Create a bunch of springs using the helpers above
  const [props, api] = useSprings(posts.length, (i) => ({
    ...to(i),
    from: from(i),
  }))
  const bind = useDrag(
    ({ args: [index], down, movement: [mx], direction: [xDir], velocity }) => {
      if (!isDraggingAllowed) return
      const trigger = velocity[0] > 0.3 // If you flick hard enough it should trigger the card to fly out
      const dir = xDir < 0 ? -1 : 1 // Direction should either point left or right
      if (!down && trigger) gone.add(index) // If button/finger's up and trigger velocity is reached, we flag the card ready to fly out
      api.start((i) => {
        if (index !== i) return // We're only interested in changing spring-data for the current spring
        const isGone = gone.has(index)
        const x = isGone ? (200 + window.innerWidth) * dir : down ? mx : 0 // When a card is gone it flys out left or right, otherwise goes back to zero
        const rot = mx / 100 + (isGone ? dir * 10 * velocity[0] : 5) // How much the card tilts, flicking it harder makes it rotate faster
        const scale = down ? 1.1 : 1 // Active cards lift up a bit
        return {
          x,
          rot,
          scale,
          delay: undefined,
          config: { friction: 50, tension: down ? 800 : isGone ? 200 : 500 },
        }
      })
      if (!down && gone.size === posts.length)
        setTimeout(() => {
          gone.clear()
          api.start((i) => to(i))
        }, 600)
    }
  )

  const undoFlashCard = () => {
    setTimeout(() => {
      // Lấy phần tử cuối cùng đã flick out
      const lastGone = Array.from(gone).pop()

      if (lastGone !== undefined) {
        gone.delete(lastGone) // Xóa card cuối cùng ra khỏi tập gone
        api.start((i) => {
          if (i !== lastGone) return // Chỉ cập nhật card mà chúng ta đang redo
          return {
            x: 0, // Đặt lại vị trí x về 0 (giữa màn hình)
            rot: 0, // Đặt lại độ xoay
            scale: 1, // Đặt lại tỷ lệ
            config: { friction: 50, tension: 500 }, // Cấu hình lại animation
          }
        })
      }
    }, 600)
  }

  const enableDrag = (isEnabled: boolean = true) =>
    setIsDraggingAllowed(isEnabled)

  return {
    props,
    bind,
    trans,
    enableDrag,
    undoFlashCard,
  }
}
