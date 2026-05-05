
import { gql } from "graphql-tag";

export const GetUsersDocument = gql`
  query GetUsers {
    users {
      id
      email
      username
      profileImgUrl
    }
  }
`;