
import { gql } from "graphql-tag";

export const GetMessagesDocument = gql`
  query GetMessages($conversationId: String!) {
  getMessages(conversationId: $conversationId) {
    id
    content
    createdAt
    sender {
      id
      username
      profileImgUrl
    }
  }
}
`;