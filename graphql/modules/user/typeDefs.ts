import { gql } from "graphql-tag";

export const userTypeDefs  = gql`
    
  type User {
    id: String!
    email: String!
    username: String!
    firstName: String
    lastName: String
    profileImgUrl: String
    createdAt: String!
    updatedAt: String!
    tweets: [Post]
  }
  
  type Query {
    users: [User]!
    currUser: User
  }

`;