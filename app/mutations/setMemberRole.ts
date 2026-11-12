
import { gql } from "graphql-tag";

export const SetMemberRoleDocument = gql`
  mutation SetMemberRole(
    $conversationId: String!
    $userId: String!
    $role: ConversationRole!
  ) {
    setMemberRole(
      conversationId: $conversationId
      userId: $userId
      role: $role
    )
  }
`;
