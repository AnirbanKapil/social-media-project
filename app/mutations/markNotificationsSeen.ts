import { gql } from "graphql-tag";

export const MarkNotificationsSeenDocument = gql`
  mutation MarkNotificationsSeen {
    markNotificationsSeen
  }
`;
