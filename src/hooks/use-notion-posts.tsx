import { graphql, useStaticQuery } from 'gatsby'
import { NotionPostQuery } from '../uxcomic-types'

interface NotionPostsQueryData {
  allNotionPost: {
    nodes: NotionPostQuery[]
  }
}

export const useNotionPosts = () => {
  const data = useStaticQuery<NotionPostsQueryData>(graphql`
    query {
      allNotionPost {
        nodes {
          post {
            id
            title
            cover
            publish
            type
            createdTime
            url
            category {
              id
              title
              icon
              url
            }
            tag {
              id
              name
              title
              order
              databaseId
              categoryId
              url
            }
            content {
              id
              type
              data {
                value
                caption
              }
            }
          }
        }
      }
    }
  `)

  return data.allNotionPost.nodes
}
