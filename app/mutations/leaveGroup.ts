
import { gql } from "graphql-tag";

export const LeaveGroupDocument = gql`
  mutation LeaveGroup($conversationId: String!) {
    leaveGroup(conversationId: $conversationId)
  }
`;
