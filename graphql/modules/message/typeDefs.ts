
import { gql } from "graphql-tag";


export const messageTypeDefs = gql`
  type Conversation {
    id: ID!
    participants: [User!]!
    messages: [Message!]!
    lastMessage: Message
    unreadCount: Int!
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

  type Query {
    getConversations: [Conversation!]!
    getMessages(conversationId: String!): [Message!]!
    unreadMessageCount: Int!
  }

  type Mutation {
    createConversation(userId: String) : Conversation
    sendMessage(conversationId: String! content: String!) : Message!
    markConversationRead(conversationId: String!): Boolean!
  }
`;