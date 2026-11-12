
import { gql } from "graphql-tag";

export const AddGroupMembersDocument = gql`
  mutation AddGroupMembers($conversationId: String!, $userIds: [String!]!) {
    addGroupMembers(conversationId: $conversationId, userIds: $userIds) {
      id
      memberCount
    }
  }
`;
