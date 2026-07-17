
import { gql } from "graphql-tag";


export const CreateCommentDocument = gql`
   mutation CreateComment($postId: String! , $content: String!) {
   createComment(postId: $postId, content: $content) {
     content,
     post{
        id
     }
     author{
        username
        profileImgUrl 
     }        
    }
 }
`;