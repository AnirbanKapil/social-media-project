import { gql } from "graphql-tag";

export const UnreadMessageCountDocument = gql`
  query UnreadMessageCount {
    unreadMessageCount
  }
`;
