
import { gql } from "graphql-tag";

export const REMOVE_PROFILE_IMAGE = gql`
  mutation RemoveProfileImage {
    removeProfileImage {
      id
      profileImgUrl
      profileImgPublicId
    }
  }
`;