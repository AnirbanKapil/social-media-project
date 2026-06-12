
import { gql } from "graphql-tag";


export const UnfollowUserDocument = gql`
   mutation UnfollowUser($to: String!) {
       unfollowUser(to: $to) {
          followerId
          followingId
       }
   } 
`;