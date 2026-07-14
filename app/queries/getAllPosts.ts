
import { gql } from "graphql-tag";


export const GetAllPostsDocument = gql`
  query GetAllPosts {
    getAllPosts {
        id, 
        content,
        imgURL,
        likesCount
        isLiked
        commentsCount
        createdAt
        author {   
            id,
            username,
            profileImgUrl,
        }
    }
  }
`;