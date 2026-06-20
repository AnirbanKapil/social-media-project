
import { gql } from "graphql-tag";

export const UPDATE_PROFILE_IMAGE = gql`
  mutation UpdateProfileImage($profileImgUrl: String!) {
    updateProfileImage(profileImgUrl: $profileImgUrl) {
      id
      profileImgUrl
    }
  }
`;