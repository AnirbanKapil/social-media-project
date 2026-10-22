import { gql } from "graphql-tag";

export const UnreadNotificationCountDocument = gql`
  query UnreadNotificationCount {
    unreadNotificationCount
  }
`;
