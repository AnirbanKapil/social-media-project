
import { gql } from "graphql-tag";

export const GetUserDocument = gql`
  query GetCurrentUser {
    currUser {
      id
      email
      username
      profileImgUrl
      followersCount
      followingCount
      posts {
        id
        content
        imgURL
        createdAt
     }
    }
 }  
`;