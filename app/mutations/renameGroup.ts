
import { gql } from "graphql-tag";

export const RenameGroupDocument = gql`
  mutation RenameGroup($conversationId: String!, $name: String!) {
    renameGroup(conversationId: $conversationId, name: $name) {
      id
      name
    }
  }
`;
