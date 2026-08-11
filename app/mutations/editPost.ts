
import { gql } from "graphql-tag";

export const EditPostDocument = gql`
  mutation EditPost($payload: EditPostPayload!) {
    editPost(payload: $payload) {
       id
       content
       imgURL
       createdAt
       updatedAt
       author {
         id
         username
       }   
    }
  }
`;