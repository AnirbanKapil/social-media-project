
import { gql } from "graphql-tag";


export const mutations = gql`
    createPost(payload : CreatePostData!): Post    
`