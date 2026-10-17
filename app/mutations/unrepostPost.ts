
import { gql } from "graphql-tag";

export const UnrepostPostDocument = gql`
   mutation UnrepostPost($postId: String!) {
     unrepostPost(postId: $postId) {
        id
        isReposted
        repostsCount
        author {
          id
        }
     }
   }
`;
