
import { gql } from "graphql-tag";

export const GetSuggestedUsersDocument = gql`
  query GetSuggestedUsers($limit: Int) {
    suggestedUsers(limit: $limit) {
      id
      username
      firstName
      lastName
      profileImgUrl
    }
  }
`;
