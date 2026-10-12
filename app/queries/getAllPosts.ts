
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
      nextCursor
      hasMore
    }
  }
`;