
import { gql } from "graphql-tag";

export const GetBookmarkedPostsDocument = gql`
  query GetBookmarkedPosts($first: Int!, $after: String) {
    getBookmarkedPosts(first: $first, after: $after) {
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
