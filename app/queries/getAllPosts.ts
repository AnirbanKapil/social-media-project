
import { gql } from "graphql-tag";


export const GetAllPostsDocument = gql`
  query GetAllPosts($first: Int!, $after: String) {
    getAllPosts(first: $first, after: $after) {
      posts {
        id
        content
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