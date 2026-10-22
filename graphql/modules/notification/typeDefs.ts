import { gql } from "graphql-tag";

export const notificationTypeDefs = gql`
  type Notification {
    id: ID!
    type: String!
    actor: User!
    post: Post
    comment: Comment
    readAt: String
    createdAt: String!
  }

  type NotificationPage {
    notifications: [Notification!]!
    nextCursor: String
    hasMore: Boolean!
  }

  type Query {
    getNotifications(first: Int = 20, after: String, unreadOnly: Boolean = false): NotificationPage!
    unreadNotificationCount: Int!
  }

  type Mutation {
    markNotificationRead(notificationId: String!): Boolean!
    markAllNotificationsRead: Boolean!
  }
`;
