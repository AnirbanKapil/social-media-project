import { gql } from "graphql-tag";

export const AppendThreadPartDocument = gql`
  mutation AppendThreadPart($postId: String!, $payload: CreateThreadPartPayload!) {
    appendThreadPart(postId: $postId, payload: $payload) {
      id
      content
      visibility
      imgURL
      imgURLs
      threadRootId
      threadPosition
      createdAt
      author {
        id
        username
        profileImgUrl
        firstName
        lastName
      }
    }
  }
`;
