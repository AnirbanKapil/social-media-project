import { gql } from "graphql-tag";

export const postTypeDefs = gql`

  type Post {
    id: Int!
    content: String!
    imgURL: String
    author: User 
  }
`