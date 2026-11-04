import { gql } from "graphql-tag";

export const MarkConversationReadDocument = gql`
  mutation MarkConversationRead($conversationId: String!) {
    markConversationRead(conversationId: $conversationId)
  }
`;
