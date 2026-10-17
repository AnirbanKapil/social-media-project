
import { gql } from "graphql-tag";

export const RepostPostDocument = gql`
   mutation RepostPost($postId: String!) {
     repostPost(postId: $postId) {
        id
        isReposted
        repostsCount
        author {
          id
        }
     }
   }
`;
