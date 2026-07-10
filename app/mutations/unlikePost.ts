
import { gql } from "graphql-tag";

export const UnLikePostDocument = gql`
   mutation UnLikePost($postId: String!) {
     UnlikePost(postId: $postId) {
        userId 
        postId    
     }
   }
`;