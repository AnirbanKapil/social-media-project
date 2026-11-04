import { gql } from "graphql-tag";

export const UnseenNotificationCountDocument = gql`
  query UnseenNotificationCount {
    unseenNotificationCount
  }
`;
