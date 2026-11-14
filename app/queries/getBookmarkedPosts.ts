
import { gql } from "graphql-tag";

export const GetBookmarkedPostsDocument = gql`
  query GetBookmarkedPosts($first: Int!, $after: String) {
    getBookmarkedPosts(first: $first, after: $after) {
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
        threadRootId
        threadPosition
        threadPartCount
        isThreadPart
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
          threadRootId
          threadPosition
          threadPartCount
          isThreadPart
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
