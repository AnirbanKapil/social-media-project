
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
        imgURLs
        createdAt
        likesCount
        isLiked
        commentsCount
     }
    }
 }  
`;