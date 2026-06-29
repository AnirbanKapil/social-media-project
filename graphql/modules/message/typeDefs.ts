
import { gql } from "graphql-tag";


export const messageTypeDefs = gql`
  type Conversation {
    id: ID!
    participants: [User!]!
    messages: [Message!]!
    createdAt: String!
    updatedAt: String!
  }

  type Message {
    id: ID!
    content: String!
    sender: User!
    conversation: Conversation!
    createdAt: String!
    updatedAt: String!
  }
`;