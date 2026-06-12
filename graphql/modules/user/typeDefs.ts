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
    posts: [Post]

    followers: [User]
    followings : [User]
  }
  
  type Query {
    users: [User]!
    currUser: User
    getUserByUsername(username: String!): User
  }

  type Post {
    id: String!
    content: String!
    imgURL: String
    author: User 
  }

  type Follows {
     followerId: String!
     followingId: String!
  }
  
  type Mutation {
    followUser(to : String!): Follows! 
    unfollowUser(to : String!): Follows
  }  

`;