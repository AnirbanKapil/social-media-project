import { gql } from "graphql-tag";

export const postTypeDefs = gql`
  
  input CreatePostData {
    content: String!
    imgURL: String
  }

  type Post {
    id: Int!
    content: String!
    imgURL: String
    author: User 
  }
`