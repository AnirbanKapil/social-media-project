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

export type Conversation = {
  __typename?: 'Conversation';
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
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
  createConversation?: Maybe<Conversation>;
  createPost?: Maybe<Post>;
  followUser: Follows;
  removeProfileImage?: Maybe<User>;
  sendMessage: Message;
  unfollowUser?: Maybe<Follows>;
  updateProfileImage?: Maybe<User>;
};


export type MutationCreateConversationArgs = {
  userId?: InputMaybe<Scalars['String']['input']>;
};


export type MutationCreatePostArgs = {
  payload: CreatePostPayload;
};


export type MutationFollowUserArgs = {
  to: Scalars['String']['input'];
};


export type MutationSendMessageArgs = {
  content: Scalars['String']['input'];
  conversationId: Scalars['String']['input'];
};


export type MutationUnfollowUserArgs = {
  to: Scalars['String']['input'];
};


export type MutationUpdateProfileImageArgs = {
  profileImgPublicId?: InputMaybe<Scalars['String']['input']>;
  profileImgUrl: Scalars['String']['input'];
};

export type Post = {
  __typename?: 'Post';
  author?: Maybe<User>;
  content: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['String']['output'];
  imgURL?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  currUser?: Maybe<User>;
  getAllPosts: Array<Maybe<Post>>;
  getConversations: Array<Conversation>;
  getMessages?: Maybe<Message>;
  getUserByUsername?: Maybe<User>;
  users: Array<Maybe<User>>;
};


export type QueryGetMessagesArgs = {
  conversationId?: InputMaybe<Scalars['String']['input']>;
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

export type UnfollowUserMutationVariables = Exact<{
  to: string;
}>;


export type UnfollowUserMutation = { unfollowUser: { followerId: string, followingId: string } | null };

export type UpdateProfileImageMutationVariables = Exact<{
  profileImgUrl: string;
  profileImgPublicId?: string | null | undefined;
}>;


export type UpdateProfileImageMutation = { updateProfileImage: { id: string, profileImgUrl: string | null, profileImgPublicId: string | null } | null };

export type GetAllPostsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllPostsQuery = { getAllPosts: Array<{ id: string, content: string, imgURL: string | null, createdAt: string, author: { id: string, username: string, profileImgUrl: string | null } | null } | null> };

export type GetCurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentUserQuery = { currUser: { id: string, email: string, username: string, profileImgUrl: string | null, followersCount: number, followingCount: number, posts: Array<{ id: string, content: string, imgURL: string | null, createdAt: string } | null> | null } | null };

export type GetUserByUsernameQueryVariables = Exact<{
  username: string;
}>;


export type GetUserByUsernameQuery = { getUserByUsername: { id: string, email: string, username: string, profileImgUrl: string | null, isFollowing: boolean, followersCount: number, followingCount: number, posts: Array<{ id: string, content: string, imgURL: string | null, createdAt: string } | null> | null } | null };

export type GetUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUsersQuery = { users: Array<{ id: string, email: string, username: string, profileImgUrl: string | null } | null> };

export type GetMeQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMeQuery = { currUser: { id: string, email: string } | null };



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
