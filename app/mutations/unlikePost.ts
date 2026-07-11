
import { gql } from "graphql-tag";

export const UnLikePostDocument = gql`
   mutation UnlikePost($postId: String!) {
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