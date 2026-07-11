
import { gql } from "graphql-tag";

export const UnLikePostDocument = gql`
   mutation UnLikePost($postId: String!) {
     unlikePost(postId: $postId) {
        id
        isLiked
        likesCount
        author {  
          id
        }       
     }
   }
`;