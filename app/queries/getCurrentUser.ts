
import { gql } from "graphql-tag";

export const GetUserDocument = gql`
  query GetCurrentUser {
    currUser {
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