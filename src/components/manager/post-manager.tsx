import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../redux/store'
import { useNotionPosts } from '../../hooks'
import { setPosts } from '../../redux/slices/post-slice'
import { Post } from '../../uxcomic-types'

const PostManager: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const posts = useNotionPosts()

  useEffect(() => {
    if (posts.length) {
      dispatch(
        setPosts(
          posts
            .filter(({ post }) => post.publish === 'true')
            .map(
              ({ post }): Post => ({
                id: post.id,
                title: post.title,
                cover: post.cover || process.env.GATSBY_THUMBNAIL_DEFAULT || '',
                publish: post.publish,
                type: post.type,
                createdTime: post.createdTime,
                tagId: post.tag.id,
                categoryId: post.category.id,
                content: post.content,
                url: post.url,
              })
            )
        )
      )
    }
  }, [posts, dispatch])

  return null
}

export default PostManager
