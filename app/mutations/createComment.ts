
import { gql } from "graphql-tag";


export const CreateCommentDocument = gql`
   mutation CreateComment($postId: String! , $content: String!, $parentCommentId: String) {
   createComment(postId: $postId, content: $content, parentCommentId: $parentCommentId) {
     id
     content,
     parentId,
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