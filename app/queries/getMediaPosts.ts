
import { gql } from "graphql-tag";

export const GetMediaPostsDocument = gql`
  query GetMediaPosts($first: Int!, $after: String) {
    getMediaPosts(first: $first, after: $after) {
      posts {
        id
        content
        imgURL
        imgURLs
        createdAt
        author {
          id
          username
          profileImgUrl
        }
      }
      nextCursor
      hasMore
    }
  }
`;
