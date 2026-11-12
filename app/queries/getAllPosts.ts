
import { gql } from "graphql-tag";


export const GetAllPostsDocument = gql`
  query GetAllPosts($first: Int!, $after: String) {
    getAllPosts(first: $first, after: $after) {
      posts {
        id
        content
        visibility
        imgURL
        imgURLs
        likesCount
        isLiked
        isBookmarked
        isReposted
        repostsCount
        repostOfId
        commentsCount
        createdAt
        author {
          id
          username
          profileImgUrl
          firstName
          lastName
        }
        repostOf {
          id
          content
          visibility
          imgURLs
          likesCount
          isLiked
          isBookmarked
          isReposted
          repostsCount
          commentsCount
          createdAt
          author {
            id
            username
            profileImgUrl
            firstName
            lastName
          }
        }
      }
      nextCursor
      hasMore
    }
  }
`;