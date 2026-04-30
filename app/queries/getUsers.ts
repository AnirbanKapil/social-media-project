
import { gql } from "graphql-request";

export const GetUsersDocument = gql`
  query GetUsers {
    users {
      id
      email
      username
    }
  }
`;