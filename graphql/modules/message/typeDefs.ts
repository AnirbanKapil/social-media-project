
import { gql } from "graphql-tag";


export const messageTypeDefs = gql`
  enum ConversationRole {
    OWNER
    ADMIN
    MEMBER
  }

  type ConversationMember {
    user: User!
    role: ConversationRole!
    joinedAt: String!
  }

  type Conversation {
    id: ID!
    isGroup: Boolean!
    name: String
    myRole: ConversationRole
    memberCount: Int!
    members: [ConversationMember!]!
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
    createGroupConversation(name: String!, participantIds: [String!]!): Conversation!
    addGroupMembers(conversationId: String!, userIds: [String!]!): Conversation!
    removeGroupMember(conversationId: String!, userId: String!): Boolean!
    setMemberRole(conversationId: String!, userId: String!, role: ConversationRole!): Boolean!
    renameGroup(conversationId: String!, name: String!): Conversation!
    transferOwnership(conversationId: String!, userId: String!): Boolean!
    leaveGroup(conversationId: String!): Boolean!
    deleteGroup(conversationId: String!): Boolean!
    sendMessage(conversationId: String! content: String!) : Message!
    markConversationRead(conversationId: String!): Boolean!
  }
`;