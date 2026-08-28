
import { gql } from "graphql-tag";

export const GetUserByUsernameDocument = gql`
  query GetUserByUsername($username: String!) {
    getUserByUsername(username: $username) {
        id
        email
        username
        firstName
        lastName
        profileImgUrl
        isFollowing
        followersCount
        followingCount
        posts {
          id
          content
          imgURL
          createdAt
          likesCount
          isLiked
          commentsCount
     }
    }
  }
`;