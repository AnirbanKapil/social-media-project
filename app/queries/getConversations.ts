
import { gql } from "graphql-tag";


export const GetConversationsDocument =  gql`
    query GetConversations {
       getConversations {
       id
       unreadCount
       participants {
           id
           username
           profileImgUrl
        }
        lastMessage {
        content
        createdAt
       }   
     }
    }
`;