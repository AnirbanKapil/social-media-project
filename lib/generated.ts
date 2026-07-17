/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import { useMutation, useQuery, UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';
import { useCustomFetcher } from './fetcher';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;

          class TypedDocumentString<TResult, TVariables> extends String {
            private __apiType?: TResult;
            private __variables?: TVariables;
            constructor(private value: string) {
            super(value);
            }
            toString(): string {
            return this.value;
          }
        }
        
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Comment = {
  __typename?: 'Comment';
  author: User;
  content: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  post: Post;
  updatedAt: Scalars['String']['output'];
};

export type Conversation = {
  __typename?: 'Conversation';
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastMessage?: Maybe<Message>;
  messages: Array<Message>;
  participants: Array<User>;
  updatedAt: Scalars['String']['output'];
};

export type CreatePostPayload = {
  content: Scalars['String']['input'];
  imgURL?: InputMaybe<Scalars['String']['input']>;
};

export type Follows = {
  __typename?: 'Follows';
  followerId: Scalars['String']['output'];
  followingId: Scalars['String']['output'];
};

export type Like = {
  __typename?: 'Like';
  postId: Scalars['String']['output'];
  userId: Scalars['String']['output'];
};

export type Message = {
  __typename?: 'Message';
  content: Scalars['String']['output'];
  conversation: Conversation;
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  sender: User;
  updatedAt: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createComment: Comment;
  createConversation?: Maybe<Conversation>;
  createPost?: Maybe<Post>;
  deleteComment: Scalars['Boolean']['output'];
  followUser: Follows;
  likePost?: Maybe<Post>;
  removeProfileImage?: Maybe<User>;
  sendMessage: Message;
  unfollowUser?: Maybe<Follows>;
  unlikePost?: Maybe<Post>;
  updateProfileImage?: Maybe<User>;
};


export type MutationCreateCommentArgs = {
  content: Scalars['String']['input'];
  postId: Scalars['String']['input'];
};


export type MutationCreateConversationArgs = {
  userId?: InputMaybe<Scalars['String']['input']>;
};


export type MutationCreatePostArgs = {
  payload: CreatePostPayload;
};


export type MutationDeleteCommentArgs = {
  commentId: Scalars['String']['input'];
};


export type MutationFollowUserArgs = {
  to: Scalars['String']['input'];
};


export type MutationLikePostArgs = {
  postId: Scalars['String']['input'];
};


export type MutationSendMessageArgs = {
  content: Scalars['String']['input'];
  conversationId: Scalars['String']['input'];
};


export type MutationUnfollowUserArgs = {
  to: Scalars['String']['input'];
};


export type MutationUnlikePostArgs = {
  postId: Scalars['String']['input'];
};


export type MutationUpdateProfileImageArgs = {
  profileImgPublicId?: InputMaybe<Scalars['String']['input']>;
  profileImgUrl: Scalars['String']['input'];
};

export type Post = {
  __typename?: 'Post';
  author?: Maybe<User>;
  comments: Array<Comment>;
  commentsCount: Scalars['Int']['output'];
  content: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['String']['output'];
  imgURL?: Maybe<Scalars['String']['output']>;
  isLiked: Scalars['Boolean']['output'];
  likesCount: Scalars['Int']['output'];
  updatedAt: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  currUser?: Maybe<User>;
  getAllPosts: Array<Maybe<Post>>;
  getComments: Array<Comment>;
  getConversations: Array<Conversation>;
  getMessages: Array<Message>;
  getUserByUsername?: Maybe<User>;
  users: Array<Maybe<User>>;
};


export type QueryGetCommentsArgs = {
  postId: Scalars['String']['input'];
};


export type QueryGetMessagesArgs = {
  conversationId: Scalars['String']['input'];
};


export type QueryGetUserByUsernameArgs = {
  username: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['String']['output'];
  email: Scalars['String']['output'];
  firstName?: Maybe<Scalars['String']['output']>;
  followers?: Maybe<Array<Maybe<User>>>;
  followersCount: Scalars['Int']['output'];
  followingCount: Scalars['Int']['output'];
  followings?: Maybe<Array<Maybe<User>>>;
  id: Scalars['String']['output'];
  isFollowing: Scalars['Boolean']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  posts?: Maybe<Array<Maybe<Post>>>;
  profileImgPublicId?: Maybe<Scalars['String']['output']>;
  profileImgUrl?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['String']['output'];
  username: Scalars['String']['output'];
};

export type CreatePostPayload = {
  content: string;
  imgURL?: string | null | undefined;
};

export type CreateCommentMutationVariables = Exact<{
  postId: string;
  content: string;
}>;


export type CreateCommentMutation = { createComment: { content: string, post: { id: string }, author: { username: string, profileImgUrl: string | null } } };

export type CreateConversationMutationVariables = Exact<{
  userId: string;
}>;


export type CreateConversationMutation = { createConversation: { id: string, participants: Array<{ id: string, username: string }> } | null };

export type CreatePostMutationVariables = Exact<{
  payload: CreatePostPayload;
}>;


export type CreatePostMutation = { createPost: { id: string, content: string, imgURL: string | null, author: { id: string, username: string, email: string } | null } | null };

export type RemoveProfileImageMutationVariables = Exact<{ [key: string]: never; }>;


export type RemoveProfileImageMutation = { removeProfileImage: { id: string, profileImgUrl: string | null, profileImgPublicId: string | null } | null };

export type FollowUserMutationVariables = Exact<{
  to: string;
}>;


export type FollowUserMutation = { followUser: { followerId: string, followingId: string } };

export type LikePostMutationVariables = Exact<{
  postId: string;
}>;


export type LikePostMutation = { likePost: { id: string, isLiked: boolean, likesCount: number, author: { id: string } | null } | null };

export type SendMessageMutationVariables = Exact<{
  conversationId: string;
  content: string;
}>;


export type SendMessageMutation = { sendMessage: { id: string, content: string, createdAt: string } };

export type UnfollowUserMutationVariables = Exact<{
  to: string;
}>;


export type UnfollowUserMutation = { unfollowUser: { followerId: string, followingId: string } | null };

export type UnlikePostMutationVariables = Exact<{
  postId: string;
}>;


export type UnlikePostMutation = { unlikePost: { id: string, isLiked: boolean, likesCount: number, author: { id: string } | null } | null };

export type UpdateProfileImageMutationVariables = Exact<{
  profileImgUrl: string;
  profileImgPublicId?: string | null | undefined;
}>;


export type UpdateProfileImageMutation = { updateProfileImage: { id: string, profileImgUrl: string | null, profileImgPublicId: string | null } | null };

export type GetAllPostsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllPostsQuery = { getAllPosts: Array<{ id: string, content: string, imgURL: string | null, likesCount: number, isLiked: boolean, commentsCount: number, createdAt: string, author: { id: string, username: string, profileImgUrl: string | null } | null } | null> };

export type GetCommentsQueryVariables = Exact<{
  postId: string;
}>;


export type GetCommentsQuery = { getComments: Array<{ id: string, content: string, author: { id: string, username: string, profileImgUrl: string | null } }> };

export type GetConversationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetConversationsQuery = { getConversations: Array<{ id: string, participants: Array<{ id: string, username: string, profileImgUrl: string | null }>, lastMessage: { content: string, createdAt: string } | null }> };

export type GetCurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentUserQuery = { currUser: { id: string, email: string, username: string, profileImgUrl: string | null, followersCount: number, followingCount: number, posts: Array<{ id: string, content: string, imgURL: string | null, createdAt: string, likesCount: number, isLiked: boolean, commentsCount: number } | null> | null } | null };

export type GetMessagesQueryVariables = Exact<{
  conversationId: string;
}>;


export type GetMessagesQuery = { getMessages: Array<{ id: string, content: string, createdAt: string, sender: { id: string, username: string, profileImgUrl: string | null } }> };

export type GetUserByUsernameQueryVariables = Exact<{
  username: string;
}>;


export type GetUserByUsernameQuery = { getUserByUsername: { id: string, email: string, username: string, profileImgUrl: string | null, isFollowing: boolean, followersCount: number, followingCount: number, posts: Array<{ id: string, content: string, imgURL: string | null, createdAt: string, likesCount: number, isLiked: boolean, commentsCount: number } | null> | null } | null };

export type GetUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUsersQuery = { users: Array<{ id: string, email: string, username: string, profileImgUrl: string | null } | null> };

export type GetMeQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMeQuery = { currUser: { id: string, email: string } | null };



export const CreateCommentDocument = new TypedDocumentString(`
    mutation CreateComment($postId: String!, $content: String!) {
  createComment(postId: $postId, content: $content) {
    content
    post {
      id
    }
    author {
      username
      profileImgUrl
    }
  }
}
    `);

export const useCreateCommentMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreateCommentMutation, TError, CreateCommentMutationVariables, TContext>) => {
    
    return useMutation<CreateCommentMutation, TError, CreateCommentMutationVariables, TContext>(
      {
    mutationKey: ['CreateComment'],
    mutationFn: (variables?: CreateCommentMutationVariables) => useCustomFetcher<CreateCommentMutation, CreateCommentMutationVariables>(CreateCommentDocument, variables)(),
    ...options
  }
    )};

export const CreateConversationDocument = new TypedDocumentString(`
    mutation CreateConversation($userId: String!) {
  createConversation(userId: $userId) {
    id
    participants {
      id
      username
    }
  }
}
    `);

export const useCreateConversationMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreateConversationMutation, TError, CreateConversationMutationVariables, TContext>) => {
    
    return useMutation<CreateConversationMutation, TError, CreateConversationMutationVariables, TContext>(
      {
    mutationKey: ['CreateConversation'],
    mutationFn: (variables?: CreateConversationMutationVariables) => useCustomFetcher<CreateConversationMutation, CreateConversationMutationVariables>(CreateConversationDocument, variables)(),
    ...options
  }
    )};

export const CreatePostDocument = new TypedDocumentString(`
    mutation CreatePost($payload: CreatePostPayload!) {
  createPost(payload: $payload) {
    id
    content
    imgURL
    author {
      id
      username
      email
    }
  }
}
    `);

export const useCreatePostMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreatePostMutation, TError, CreatePostMutationVariables, TContext>) => {
    
    return useMutation<CreatePostMutation, TError, CreatePostMutationVariables, TContext>(
      {
    mutationKey: ['CreatePost'],
    mutationFn: (variables?: CreatePostMutationVariables) => useCustomFetcher<CreatePostMutation, CreatePostMutationVariables>(CreatePostDocument, variables)(),
    ...options
  }
    )};

export const RemoveProfileImageDocument = new TypedDocumentString(`
    mutation RemoveProfileImage {
  removeProfileImage {
    id
    profileImgUrl
    profileImgPublicId
  }
}
    `);

export const useRemoveProfileImageMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<RemoveProfileImageMutation, TError, RemoveProfileImageMutationVariables, TContext>) => {
    
    return useMutation<RemoveProfileImageMutation, TError, RemoveProfileImageMutationVariables, TContext>(
      {
    mutationKey: ['RemoveProfileImage'],
    mutationFn: (variables?: RemoveProfileImageMutationVariables) => useCustomFetcher<RemoveProfileImageMutation, RemoveProfileImageMutationVariables>(RemoveProfileImageDocument, variables)(),
    ...options
  }
    )};

export const FollowUserDocument = new TypedDocumentString(`
    mutation FollowUser($to: String!) {
  followUser(to: $to) {
    followerId
    followingId
  }
}
    `);

export const useFollowUserMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<FollowUserMutation, TError, FollowUserMutationVariables, TContext>) => {
    
    return useMutation<FollowUserMutation, TError, FollowUserMutationVariables, TContext>(
      {
    mutationKey: ['FollowUser'],
    mutationFn: (variables?: FollowUserMutationVariables) => useCustomFetcher<FollowUserMutation, FollowUserMutationVariables>(FollowUserDocument, variables)(),
    ...options
  }
    )};

export const LikePostDocument = new TypedDocumentString(`
    mutation LikePost($postId: String!) {
  likePost(postId: $postId) {
    id
    isLiked
    likesCount
    author {
      id
    }
  }
}
    `);

export const useLikePostMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<LikePostMutation, TError, LikePostMutationVariables, TContext>) => {
    
    return useMutation<LikePostMutation, TError, LikePostMutationVariables, TContext>(
      {
    mutationKey: ['LikePost'],
    mutationFn: (variables?: LikePostMutationVariables) => useCustomFetcher<LikePostMutation, LikePostMutationVariables>(LikePostDocument, variables)(),
    ...options
  }
    )};

export const SendMessageDocument = new TypedDocumentString(`
    mutation SendMessage($conversationId: String!, $content: String!) {
  sendMessage(conversationId: $conversationId, content: $content) {
    id
    content
    createdAt
  }
}
    `);

export const useSendMessageMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<SendMessageMutation, TError, SendMessageMutationVariables, TContext>) => {
    
    return useMutation<SendMessageMutation, TError, SendMessageMutationVariables, TContext>(
      {
    mutationKey: ['SendMessage'],
    mutationFn: (variables?: SendMessageMutationVariables) => useCustomFetcher<SendMessageMutation, SendMessageMutationVariables>(SendMessageDocument, variables)(),
    ...options
  }
    )};

export const UnfollowUserDocument = new TypedDocumentString(`
    mutation UnfollowUser($to: String!) {
  unfollowUser(to: $to) {
    followerId
    followingId
  }
}
    `);

export const useUnfollowUserMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UnfollowUserMutation, TError, UnfollowUserMutationVariables, TContext>) => {
    
    return useMutation<UnfollowUserMutation, TError, UnfollowUserMutationVariables, TContext>(
      {
    mutationKey: ['UnfollowUser'],
    mutationFn: (variables?: UnfollowUserMutationVariables) => useCustomFetcher<UnfollowUserMutation, UnfollowUserMutationVariables>(UnfollowUserDocument, variables)(),
    ...options
  }
    )};

export const UnlikePostDocument = new TypedDocumentString(`
    mutation UnlikePost($postId: String!) {
  unlikePost(postId: $postId) {
    id
    isLiked
    likesCount
    author {
      id
    }
  }
}
    `);

export const useUnlikePostMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UnlikePostMutation, TError, UnlikePostMutationVariables, TContext>) => {
    
    return useMutation<UnlikePostMutation, TError, UnlikePostMutationVariables, TContext>(
      {
    mutationKey: ['UnlikePost'],
    mutationFn: (variables?: UnlikePostMutationVariables) => useCustomFetcher<UnlikePostMutation, UnlikePostMutationVariables>(UnlikePostDocument, variables)(),
    ...options
  }
    )};

export const UpdateProfileImageDocument = new TypedDocumentString(`
    mutation UpdateProfileImage($profileImgUrl: String!, $profileImgPublicId: String) {
  updateProfileImage(
    profileImgUrl: $profileImgUrl
    profileImgPublicId: $profileImgPublicId
  ) {
    id
    profileImgUrl
    profileImgPublicId
  }
}
    `);

export const useUpdateProfileImageMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateProfileImageMutation, TError, UpdateProfileImageMutationVariables, TContext>) => {
    
    return useMutation<UpdateProfileImageMutation, TError, UpdateProfileImageMutationVariables, TContext>(
      {
    mutationKey: ['UpdateProfileImage'],
    mutationFn: (variables?: UpdateProfileImageMutationVariables) => useCustomFetcher<UpdateProfileImageMutation, UpdateProfileImageMutationVariables>(UpdateProfileImageDocument, variables)(),
    ...options
  }
    )};

export const GetAllPostsDocument = new TypedDocumentString(`
    query GetAllPosts {
  getAllPosts {
    id
    content
    imgURL
    likesCount
    isLiked
    commentsCount
    createdAt
    author {
      id
      username
      profileImgUrl
    }
  }
}
    `);

export const useGetAllPostsQuery = <
      TData = GetAllPostsQuery,
      TError = unknown
    >(
      variables?: GetAllPostsQueryVariables,
      options?: Omit<UseQueryOptions<GetAllPostsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetAllPostsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetAllPostsQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['GetAllPosts'] : ['GetAllPosts', variables],
    queryFn: useCustomFetcher<GetAllPostsQuery, GetAllPostsQueryVariables>(GetAllPostsDocument, variables),
    ...options
  }
    )};

useGetAllPostsQuery.getKey = (variables?: GetAllPostsQueryVariables) => variables === undefined ? ['GetAllPosts'] : ['GetAllPosts', variables];

export const GetCommentsDocument = new TypedDocumentString(`
    query GetComments($postId: String!) {
  getComments(postId: $postId) {
    id
    content
    author {
      id
      username
      profileImgUrl
    }
  }
}
    `);

export const useGetCommentsQuery = <
      TData = GetCommentsQuery,
      TError = unknown
    >(
      variables: GetCommentsQueryVariables,
      options?: Omit<UseQueryOptions<GetCommentsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetCommentsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetCommentsQuery, TError, TData>(
      {
    queryKey: ['GetComments', variables],
    queryFn: useCustomFetcher<GetCommentsQuery, GetCommentsQueryVariables>(GetCommentsDocument, variables),
    ...options
  }
    )};

useGetCommentsQuery.getKey = (variables: GetCommentsQueryVariables) => ['GetComments', variables];

export const GetConversationsDocument = new TypedDocumentString(`
    query GetConversations {
  getConversations {
    id
    participants {
      id
      username
      profileImgUrl
    }
    lastMessage {
      content
      createdAt
    }
  }
}
    `);

export const useGetConversationsQuery = <
      TData = GetConversationsQuery,
      TError = unknown
    >(
      variables?: GetConversationsQueryVariables,
      options?: Omit<UseQueryOptions<GetConversationsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetConversationsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetConversationsQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['GetConversations'] : ['GetConversations', variables],
    queryFn: useCustomFetcher<GetConversationsQuery, GetConversationsQueryVariables>(GetConversationsDocument, variables),
    ...options
  }
    )};

useGetConversationsQuery.getKey = (variables?: GetConversationsQueryVariables) => variables === undefined ? ['GetConversations'] : ['GetConversations', variables];

export const GetCurrentUserDocument = new TypedDocumentString(`
    query GetCurrentUser {
  currUser {
    id
    email
    username
    profileImgUrl
    followersCount
    followingCount
    posts {
      id
      content
      imgURL
      createdAt
      likesCount
      isLiked
      commentsCount
    }
  }
}
    `);

export const useGetCurrentUserQuery = <
      TData = GetCurrentUserQuery,
      TError = unknown
    >(
      variables?: GetCurrentUserQueryVariables,
      options?: Omit<UseQueryOptions<GetCurrentUserQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetCurrentUserQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetCurrentUserQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['GetCurrentUser'] : ['GetCurrentUser', variables],
    queryFn: useCustomFetcher<GetCurrentUserQuery, GetCurrentUserQueryVariables>(GetCurrentUserDocument, variables),
    ...options
  }
    )};

useGetCurrentUserQuery.getKey = (variables?: GetCurrentUserQueryVariables) => variables === undefined ? ['GetCurrentUser'] : ['GetCurrentUser', variables];

export const GetMessagesDocument = new TypedDocumentString(`
    query GetMessages($conversationId: String!) {
  getMessages(conversationId: $conversationId) {
    id
    content
    createdAt
    sender {
      id
      username
      profileImgUrl
    }
  }
}
    `);

export const useGetMessagesQuery = <
      TData = GetMessagesQuery,
      TError = unknown
    >(
      variables: GetMessagesQueryVariables,
      options?: Omit<UseQueryOptions<GetMessagesQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetMessagesQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetMessagesQuery, TError, TData>(
      {
    queryKey: ['GetMessages', variables],
    queryFn: useCustomFetcher<GetMessagesQuery, GetMessagesQueryVariables>(GetMessagesDocument, variables),
    ...options
  }
    )};

useGetMessagesQuery.getKey = (variables: GetMessagesQueryVariables) => ['GetMessages', variables];

export const GetUserByUsernameDocument = new TypedDocumentString(`
    query GetUserByUsername($username: String!) {
  getUserByUsername(username: $username) {
    id
    email
    username
    profileImgUrl
    isFollowing
    followersCount
    followingCount
    posts {
      id
      content
      imgURL
      createdAt
      likesCount
      isLiked
      commentsCount
    }
  }
}
    `);

export const useGetUserByUsernameQuery = <
      TData = GetUserByUsernameQuery,
      TError = unknown
    >(
      variables: GetUserByUsernameQueryVariables,
      options?: Omit<UseQueryOptions<GetUserByUsernameQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetUserByUsernameQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetUserByUsernameQuery, TError, TData>(
      {
    queryKey: ['GetUserByUsername', variables],
    queryFn: useCustomFetcher<GetUserByUsernameQuery, GetUserByUsernameQueryVariables>(GetUserByUsernameDocument, variables),
    ...options
  }
    )};

useGetUserByUsernameQuery.getKey = (variables: GetUserByUsernameQueryVariables) => ['GetUserByUsername', variables];

export const GetUsersDocument = new TypedDocumentString(`
    query GetUsers {
  users {
    id
    email
    username
    profileImgUrl
  }
}
    `);

export const useGetUsersQuery = <
      TData = GetUsersQuery,
      TError = unknown
    >(
      variables?: GetUsersQueryVariables,
      options?: Omit<UseQueryOptions<GetUsersQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetUsersQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetUsersQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['GetUsers'] : ['GetUsers', variables],
    queryFn: useCustomFetcher<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, variables),
    ...options
  }
    )};

useGetUsersQuery.getKey = (variables?: GetUsersQueryVariables) => variables === undefined ? ['GetUsers'] : ['GetUsers', variables];

export const GetMeDocument = new TypedDocumentString(`
    query GetMe {
  currUser {
    id
    email
  }
}
    `);

export const useGetMeQuery = <
      TData = GetMeQuery,
      TError = unknown
    >(
      variables?: GetMeQueryVariables,
      options?: Omit<UseQueryOptions<GetMeQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetMeQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetMeQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['GetMe'] : ['GetMe', variables],
    queryFn: useCustomFetcher<GetMeQuery, GetMeQueryVariables>(GetMeDocument, variables),
    ...options
  }
    )};

useGetMeQuery.getKey = (variables?: GetMeQueryVariables) => variables === undefined ? ['GetMe'] : ['GetMe', variables];
