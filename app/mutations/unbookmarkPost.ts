
import { gql } from "graphql-tag";

export const UnbookmarkPostDocument = gql`
   mutation UnbookmarkPost($postId: String!) {
     unbookmarkPost(postId: $postId) {
        id
        isBookmarked
        author {
          id
        }
     }
   }
`;
