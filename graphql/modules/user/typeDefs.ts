
export const userTypeDefs  = `#graphql
    
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
    user(id : Int!): User
  }

  type Mutation {
     signup(
      email: String!
      username: String!
      password: String!
      firstName: String
      lastName: String
    ): User!
  }
`;