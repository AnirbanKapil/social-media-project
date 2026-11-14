
import { gql } from "graphql-tag";

export const GetUserDocument = gql`
  query GetCurrentUser {
    currUser {
      id
      email
      username
      firstName
      lastName
      profileImgUrl
      followersCount
      followingCount
      posts {
        id
        content
        visibility
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
        threadRootId
        threadPosition
        threadPartCount
        isThreadPart
        repostOf {
          id
          content
          visibility
          imgURLs
          likesCount
          isLiked
          isBookmarked
          isReposted
          repostsCount
          commentsCount
          threadRootId
          threadPosition
          threadPartCount
          isThreadPart
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