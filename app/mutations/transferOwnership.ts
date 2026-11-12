
import { gql } from "graphql-tag";

export const TransferOwnershipDocument = gql`
  mutation TransferOwnership($conversationId: String!, $userId: String!) {
    transferOwnership(conversationId: $conversationId, userId: $userId)
  }
`;
