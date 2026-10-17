
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
          imgURLs
          createdAt
          likesCount
          isLiked
          isBookmarked
          isReposted
          repostsCount
          repostOfId
          commentsCount
          repostOf {
            id
            content
            imgURLs
            likesCount
            isLiked
            isBookmarked
            isReposted
            repostsCount
            commentsCount
            createdAt
            author {
              id
              username
              profileImgUrl
              firstName
              lastName
            }
          }
     }
    }
  }
`;