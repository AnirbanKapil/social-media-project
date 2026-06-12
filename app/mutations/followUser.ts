
import { gql } from "graphql-tag";


export const FollowUserDocument = gql`
    mutation FollowUser($to: String) {
      followUser(to: $to) {
         followerId
         followingId
      }
    }
`;