import { gql } from "graphql-tag";

export const GetPostByIdDocument = gql`
  query GetPostById($postId: String!) {
    getPostById(postId: $postId) {
      id
      content
      visibility
      imgURL
      imgURLs
      createdAt
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
      thread {
        id
        content
        visibility
        imgURL
        imgURLs
        createdAt
        threadRootId
        threadPosition
        threadPartCount
        isThreadPart
        likesCount
        isLiked
        isBookmarked
        isReposted
        repostsCount
        commentsCount
        author {
          id
          username
          profileImgUrl
          firstName
          lastName
        }
      }
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
  }
`;
