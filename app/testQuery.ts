
import { gql } from "graphql-tag";

export const GET_ME = gql`
  query GetMe {
    currUser {
      id
      email
    }
  }
`;