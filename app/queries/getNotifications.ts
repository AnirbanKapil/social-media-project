import { gql } from "graphql-tag";

export const GetNotificationsDocument = gql`
  query GetNotifications($first: Int, $after: String, $unreadOnly: Boolean) {
    getNotifications(first: $first, after: $after, unreadOnly: $unreadOnly) {
      notifications {
        id
        type
        readAt
        createdAt
        actor {
          id
          username
          profileImgUrl
          firstName
          lastName
        }
        post {
          id
          content
          createdAt
        }
        comment {
          id
          content
        }
      }
      nextCursor
      hasMore
    }
  }
`;
