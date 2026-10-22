import { gql } from "graphql-tag";

export const MarkNotificationReadDocument = gql`
  mutation MarkNotificationRead($notificationId: String!) {
    markNotificationRead(notificationId: $notificationId)
  }
`;
