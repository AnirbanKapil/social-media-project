
import { gql } from "graphql-tag";

export const GetUsersDocument = gql`
  query GetCurrentUser {
    currUser {
      id
      email
      username
    }
  }
`;