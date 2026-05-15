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

export type CreatePostPayload = {
  content: Scalars['String']['input'];
  imgURL?: InputMaybe<Scalars['String']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createPost?: Maybe<Post>;
};


export type MutationCreatePostArgs = {
  payload: CreatePostPayload;
};

export type Post = {
  __typename?: 'Post';
  author?: Maybe<User>;
  content: Scalars['String']['output'];
  id: Scalars['String']['output'];
  imgURL?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  currUser?: Maybe<User>;
  getAllPosts: Array<Maybe<Post>>;
  users: Array<Maybe<User>>;
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['String']['output'];
  email: Scalars['String']['output'];
  firstName?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  profileImgUrl?: Maybe<Scalars['String']['output']>;
  tweets?: Maybe<Array<Maybe<Post>>>;
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

export type GetAllPostsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllPostsQuery = { getAllPosts: Array<{ id: string, content: string, imgURL: string | null, author: { id: string, username: string, profileImgUrl: string | null } | null } | null> };

export type GetCurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentUserQuery = { currUser: { id: string, email: string, username: string } | null };

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

export const GetAllPostsDocument = new TypedDocumentString(`
    query GetAllPosts {
  getAllPosts {
    id
    content
    imgURL
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
