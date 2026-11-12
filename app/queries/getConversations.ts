
import { gql } from "graphql-tag";


export const GetConversationsDocument =  gql`
    query GetConversations {
       getConversations {
       id
       isGroup
       name
       myRole
       memberCount
       unreadCount
       participants {
           id
           username
           profileImgUrl
        }
        members {
          role
          user {
            id
            username
            firstName
            lastName
            profileImgUrl
          }
        }
        lastMessage {
        id
        content
        createdAt
        sender {
          id
          username
        }
       }   
     }
    }
`;
