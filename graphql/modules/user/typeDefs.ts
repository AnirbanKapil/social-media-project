import { gql } from "graphql-tag";

export const userTypeDefs  = gql`
    
  type User {
    id: Int!
    email: String!
    username: String!
    firstName: String
    lastName: String
    profileImgUrl: String
    createdAt: String!
    updatedAt: String!
  }
  
  type Query {
    users: [User]!
    currUser: User
  }

`;