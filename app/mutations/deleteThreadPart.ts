import { gql } from "graphql-tag";

export const DeleteThreadPartDocument = gql`
  mutation DeleteThreadPart($postId: String!) {
    deleteThreadPart(postId: $postId)
  }
`;
