
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