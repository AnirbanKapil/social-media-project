
import { gql } from "graphql-tag";

export const CreateGroupConversationDocument = gql`
  mutation CreateGroupConversation($name: String!, $participantIds: [String!]!) {
    createGroupConversation(name: $name, participantIds: $participantIds) {
      id
      isGroup
      name
      myRole
      memberCount
    }
  }
`;
