import { gql } from "graphql-tag";

export const postTypeDefs = gql`
  
  input CreatePostPayload {
    content: String!
    imgURL: String
  }

  type Post {
    id: Int!
    content: String!
    imgURL: String
    author: User 
  }

  type Mutation {
    createPost(payload: CreatePostPayload!): Post
  }

  type Query {
    getAllPosts: [Post]!
  }
`