
import { gql } from "graphql-tag";


export const GetAllPostsDocument = gql`
  query GetAllPosts {
    getAllPosts {
        id, 
        content,
        imgURL,
        author {   
            id,
            username,
            profileImgUrl,
        }
    }
  }
`;