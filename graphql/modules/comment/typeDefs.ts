
import { gql } from "graphql-tag";


export const commentTypeDefs = gql`
  type Comment {
  id: ID!
  content: String!
  author: User!
  post: Post!
  createdAt: String!
  updatedAt: String!
  }

  type Query {
    getComments(postId: String!): [Comment!]!
  }

  type Mutation {
  createComment(postId: String!, content: String!): Comment!
  deleteComment(commentId: String!): Boolean!
  }

`;