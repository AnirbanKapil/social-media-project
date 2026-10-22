import { gql } from "graphql-tag";

export const MarkAllNotificationsReadDocument = gql`
  mutation MarkAllNotificationsRead {
    markAllNotificationsRead
  }
`;
