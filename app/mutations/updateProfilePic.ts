
import { gql } from "graphql-tag";

export const UPDATE_PROFILE_IMAGE = gql`
  mutation UpdateProfileImage(
    $profileImgUrl: String!
    $profileImgPublicId: String
    ) {
    updateProfileImage(
    profileImgUrl: $profileImgUrl
    profileImgPublicId: $profileImgPublicId
    ) {
      id
      profileImgUrl
      profileImgPublicId
    }
  }
`;