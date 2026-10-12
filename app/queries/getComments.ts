
import { gql } from "graphql-tag";

export const GetCommentsDocument = gql`
  query GetComments($postId: String!) {
  getComments(postId: $postId) {
    id 
    content
    postOwnerId
    author {
      id
      username
      profileImgUrl
    } 
  }
 }
`