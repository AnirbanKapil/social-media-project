import { gql } from "graphql-tag";

export const postTypeDefs = gql`
  
  enum PostVisibility {
    PUBLIC
    FOLLOWERS
    PRIVATE
  }

  input CreatePostPayload {
    content: String!
    imgURL: String
    imgURLs: [String!]
    visibility: PostVisibility
  }
  
  input EditPostPayload {
    postId: String!
    content: String
    imgURL: String
    imgURLs: [String!]
    visibility: PostVisibility
  }

  type Post {
    id: String!
    content: String!
    imgURL: String
    imgURLs: [String!]!
    createdAt: String!
    updatedAt: String!
    visibility: PostVisibility!
    author: User 
    isLiked: Boolean!
    likesCount: Int!
    isBookmarked: Boolean!
    commentsCount: Int!
    comments: [Comment!]!
    repostsCount: Int!
    isReposted: Boolean!
    repostOfId: String
    repostOf: Post
  }

  type Like {
     userId: String!
     postId: String!
  }

  type PostPage {
    posts: [Post!]!
    nextCursor: String
    hasMore: Boolean!
  }

  type Mutation {
    createPost(payload: CreatePostPayload!): Post
    likePost(postId: String!): Post
    unlikePost(postId: String!): Post
    bookmarkPost(postId: String!): Post
    unbookmarkPost(postId: String!): Post
    repostPost(postId: String!): Post
    unrepostPost(postId: String!): Post
    deletePost(postId: String!): Boolean!
    editPost(payload: EditPostPayload!): Post!
  }

  type Query {
    getAllPosts(first: Int = 10, after: String): PostPage!
    getMediaPosts(first: Int = 10, after: String): PostPage!
    getBookmarkedPosts(first: Int = 10, after: String): PostPage!
    getPostById(postId: String!): Post
  }
`;