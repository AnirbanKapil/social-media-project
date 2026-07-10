
import { gql } from "graphql-tag";

export const LikePostDocument = gql`
   mutation LikePost($postId: String!) {
     likePost(postId: $postId) {
        userId 
        postId    
     }
   }
`;