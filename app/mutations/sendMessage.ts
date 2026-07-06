
import { gql } from "graphql-tag";


export const SendMessageDocument = gql`
  mutation SendMessage($conversationId: String!, $content: String!) {
  sendMessage(conversationId: $conversationId, content: $content) {
    id
    content
    createdAt
  }
}
`;