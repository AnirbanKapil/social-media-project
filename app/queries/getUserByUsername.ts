
import { gql } from "graphql-tag";

export const GetUserByUsernameDocument = gql`
  query GetUserByUsername($username: String!) {
    getUserByUsername(username: $username) {
        id
        email
        username
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