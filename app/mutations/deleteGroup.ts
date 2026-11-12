
import { gql } from "graphql-tag";

export const DeleteGroupDocument = gql`
  mutation DeleteGroup($conversationId: String!) {
    deleteGroup(conversationId: $conversationId)
  }
`;
