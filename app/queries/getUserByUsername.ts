
import { gql } from "graphql-tag";

export const GetUserByUsernameDocument = gql`
  query GetUserByUsername($username: String!) {
    getUserByUsername(username: $username) {
        id
        email
        username
        profileImgUrl
        posts {
        id
        content
        imgURL
     }
    }
  }
`;