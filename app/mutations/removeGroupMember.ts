
import { gql } from "graphql-tag";

export const RemoveGroupMemberDocument = gql`
  mutation RemoveGroupMember($conversationId: String!, $userId: String!) {
    removeGroupMember(conversationId: $conversationId, userId: $userId)
  }
`;
