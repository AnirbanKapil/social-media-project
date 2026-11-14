
import { gql } from "graphql-tag";

export const GetCommentsDocument = gql`
  query GetComments($postId: String!) {
  getComments(postId: $postId) {
    id 
    content
    postOwnerId
    parentId
    createdAt
    author {
      id
      username
      profileImgUrl
    } 
  }
 }
`