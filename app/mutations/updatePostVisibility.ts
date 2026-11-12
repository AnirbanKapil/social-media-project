import { gql } from "graphql-tag";

export const UpdatePostVisibilityDocument = gql`
  mutation UpdatePostVisibility($postId: String!, $visibility: PostVisibility!) {
    updatePostVisibility(postId: $postId, visibility: $visibility) {
      id
      visibility
      author {
        id
      }
    }
  }
`;
