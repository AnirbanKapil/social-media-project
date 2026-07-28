
import { gql } from "graphql-tag";


export const SearchUserDocument = gql`
  query SearchUsers($keyword: String!) {
    searchUsers(keyword: $keyword) {
        username
        profileImgUrl
        id
    }
  }
`;