
import { gql } from "graphql-tag";


export const GetAllPostsDocument = gql`
  query GetAllPosts {
    getAllPosts {
        id, 
        content,
        imgURL,
        createdAt
        author {   
            id,
            username,
            profileImgUrl,
        }
    }
  }
`;