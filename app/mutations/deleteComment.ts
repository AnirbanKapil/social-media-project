import { gql } from "graphql-tag";

export const DeleteCommentDocument = gql`
  mutation DeleteComment($commentId: String!) {
    deleteComment(commentId: $commentId)
  }
`;
