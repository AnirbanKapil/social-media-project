
import { gql } from "graphql-tag";


export const DeletePostDocument = gql`
  mutation DeletePost($postId: String!) {
    deletePost(postId: $postId)
  }
`;