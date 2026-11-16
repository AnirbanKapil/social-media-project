import { gql } from "graphql-tag";

export const GetPopularThreadsDocument = gql`
  query GetPopularThreads($first: Int!, $after: String) {
    getPopularThreads(first: $first, after: $after) {
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
      }
      nextCursor
      hasMore
    }
  }
`;
