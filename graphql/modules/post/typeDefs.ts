import { gql } from "graphql-tag";

export const postTypeDefs = gql`
  
  input CreatePostPayload {
    content: String!
    imgURL: String
  }

  type Post {
    id: String!
    content: String!
    imgURL: String
    createdAt: String!
    updatedAt: String!
    author: User 
  }

   type User {
    id: String!
    email: String!
    username: String!
    firstName: String
    lastName: String
    profileImgUrl: String
    createdAt: String!
    updatedAt: String!
  }

  type Mutation {
    createPost(payload: CreatePostPayload!): Post
  }

  type Query {
    getAllPosts: [Post]!
  }
`