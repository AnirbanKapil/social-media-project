
import { gql } from "graphql-tag";

export const CreatePostDocument = gql`
  mutation CreatePost($payload: CreatePostPayload!) {
    createPost(payload: $payload) {
      id
      content
      visibility
      imgURL
      imgURLs
      author {
        id
        username
        email
    }
  }
}    
`;