
import { gql } from "graphql-tag";


export const CreateConversationDocument = gql`
  mutation CreateConversation($userId: String!) {
  createConversation(userId: $userId) {
    id
    participants {
       id
       username
    }
  }
}
`;