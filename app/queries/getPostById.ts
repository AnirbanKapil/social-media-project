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
      commentsCount
      author {
        id
        username
        profileImgUrl
        firstName
        lastName
      }
    }
  }
`;
