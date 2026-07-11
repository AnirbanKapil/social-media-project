
import { gql } from "graphql-tag";


export const GetAllPostsDocument = gql`
  query GetAllPosts {
    getAllPosts {
        id, 
        content,
        imgURL,
        likesCount
        isLiked
        createdAt
        author {   
            id,
            username,
            profileImgUrl,
        }
    }
  }
`;