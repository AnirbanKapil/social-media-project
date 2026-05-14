
import { gql } from "graphql-tag";

export const CreatePostDocument = gql`
  mutation CreatePost($payload: CreatePostPayload!) {
    createPost(payload: $payload) {
      id
      content
      imgURL
      author {
        id
        username
        email
    }
  }
}    
`;