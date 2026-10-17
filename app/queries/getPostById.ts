import { gql } from "graphql-tag";

export const GetPostByIdDocument = gql`
  query GetPostById($postId: String!) {
    getPostById(postId: $postId) {
      id
      content
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
  }
`;
