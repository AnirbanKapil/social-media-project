
import { gql } from "graphql-tag";

export const BookmarkPostDocument = gql`
   mutation BookmarkPost($postId: String!) {
     bookmarkPost(postId: $postId) {
        id
        isBookmarked
        author {
          id
        }
     }
   }
`;
