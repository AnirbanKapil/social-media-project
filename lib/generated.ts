/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import { useMutation, useQuery, UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';
import { useCustomFetcher } from './fetcher';

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
        
export type ConversationRole =
  | 'ADMIN'
  | 'MEMBER'
  | 'OWNER';

export type CreatePostPayload = {
  content: string;
  imgURL?: string | null | undefined;
  imgURLs?: Array<string> | null | undefined;
  visibility?: PostVisibility | null | undefined;
};

export type CreateThreadPartPayload = {
  content?: string | null | undefined;
  imgURL?: string | null | undefined;
  imgURLs?: Array<string> | null | undefined;
};

export type EditPostPayload = {
  content?: string | null | undefined;
  imgURL?: string | null | undefined;
  imgURLs?: Array<string> | null | undefined;
  postId: string;
  visibility?: PostVisibility | null | undefined;
};

export type PostVisibility =
  | 'FOLLOWERS'
  | 'PRIVATE'
  | 'PUBLIC';

export type AddGroupMembersMutationVariables = Exact<{
  conversationId: string;
  userIds: Array<string> | string;
}>;


export type AddGroupMembersMutation = { addGroupMembers: { id: string, memberCount: number } };

export type AppendThreadPartMutationVariables = Exact<{
  postId: string;
  payload: CreateThreadPartPayload;
}>;


export type AppendThreadPartMutation = { appendThreadPart: { id: string, content: string, visibility: PostVisibility, imgURL: string | null, imgURLs: Array<string>, threadRootId: string | null, threadPosition: number | null, createdAt: string, author: { id: string, username: string, profileImgUrl: string | null, firstName: string | null, lastName: string | null } | null } };

export type BookmarkPostMutationVariables = Exact<{
  postId: string;
}>;


export type BookmarkPostMutation = { bookmarkPost: { id: string, isBookmarked: boolean, author: { id: string } | null } | null };

export type CreateCommentMutationVariables = Exact<{
  postId: string;
  content: string;
}>;


export type CreateCommentMutation = { createComment: { content: string, post: { id: string }, author: { username: string, profileImgUrl: string | null } } };

export type CreateConversationMutationVariables = Exact<{
  userId: string;
}>;


export type CreateConversationMutation = { createConversation: { id: string, participants: Array<{ id: string, username: string }> } | null };

export type CreateGroupConversationMutationVariables = Exact<{
  name: string;
  participantIds: Array<string> | string;
}>;


export type CreateGroupConversationMutation = { createGroupConversation: { id: string, isGroup: boolean, name: string | null, myRole: ConversationRole | null, memberCount: number } };

export type CreatePostMutationVariables = Exact<{
  payload: CreatePostPayload;
}>;


export type CreatePostMutation = { createPost: { id: string, content: string, visibility: PostVisibility, imgURL: string | null, imgURLs: Array<string>, author: { id: string, username: string, email: string } | null } | null };

export type DeleteCommentMutationVariables = Exact<{
  commentId: string;
}>;


export type DeleteCommentMutation = { deleteComment: boolean };

export type DeleteGroupMutationVariables = Exact<{
  conversationId: string;
}>;


export type DeleteGroupMutation = { deleteGroup: boolean };

export type DeletePostMutationVariables = Exact<{
  postId: string;
}>;


export type DeletePostMutation = { deletePost: boolean };

export type RemoveProfileImageMutationVariables = Exact<{ [key: string]: never; }>;


export type RemoveProfileImageMutation = { removeProfileImage: { id: string, profileImgUrl: string | null, profileImgPublicId: string | null } | null };

export type DeleteThreadPartMutationVariables = Exact<{
  postId: string;
}>;


export type DeleteThreadPartMutation = { deleteThreadPart: boolean };

export type EditPostMutationVariables = Exact<{
  payload: EditPostPayload;
}>;


export type EditPostMutation = { editPost: { id: string, content: string, visibility: PostVisibility, imgURL: string | null, imgURLs: Array<string>, createdAt: string, updatedAt: string, author: { id: string, username: string } | null } };

export type FollowUserMutationVariables = Exact<{
  to: string;
}>;


export type FollowUserMutation = { followUser: { followerId: string, followingId: string } };

export type LeaveGroupMutationVariables = Exact<{
  conversationId: string;
}>;


export type LeaveGroupMutation = { leaveGroup: boolean };

export type LikePostMutationVariables = Exact<{
  postId: string;
}>;


export type LikePostMutation = { likePost: { id: string, isLiked: boolean, likesCount: number, author: { id: string } | null } | null };

export type MarkAllNotificationsReadMutationVariables = Exact<{ [key: string]: never; }>;


export type MarkAllNotificationsReadMutation = { markAllNotificationsRead: boolean };

export type MarkConversationReadMutationVariables = Exact<{
  conversationId: string;
}>;


export type MarkConversationReadMutation = { markConversationRead: boolean };

export type MarkNotificationReadMutationVariables = Exact<{
  notificationId: string;
}>;


export type MarkNotificationReadMutation = { markNotificationRead: boolean };

export type MarkNotificationsSeenMutationVariables = Exact<{ [key: string]: never; }>;


export type MarkNotificationsSeenMutation = { markNotificationsSeen: boolean };

export type RemoveGroupMemberMutationVariables = Exact<{
  conversationId: string;
  userId: string;
}>;


export type RemoveGroupMemberMutation = { removeGroupMember: boolean };

export type RenameGroupMutationVariables = Exact<{
  conversationId: string;
  name: string;
}>;


export type RenameGroupMutation = { renameGroup: { id: string, name: string | null } };

export type RepostPostMutationVariables = Exact<{
  postId: string;
}>;


export type RepostPostMutation = { repostPost: { id: string, isReposted: boolean, repostsCount: number, author: { id: string } | null } | null };

export type RequestAccountDeletionMutationVariables = Exact<{ [key: string]: never; }>;


export type RequestAccountDeletionMutation = { requestAccountDeletion: string };

export type SendMessageMutationVariables = Exact<{
  conversationId: string;
  content: string;
}>;


export type SendMessageMutation = { sendMessage: { id: string, content: string, createdAt: string } };

export type SetMemberRoleMutationVariables = Exact<{
  conversationId: string;
  userId: string;
  role: ConversationRole;
}>;


export type SetMemberRoleMutation = { setMemberRole: boolean };

export type TransferOwnershipMutationVariables = Exact<{
  conversationId: string;
  userId: string;
}>;


export type TransferOwnershipMutation = { transferOwnership: boolean };

export type UnbookmarkPostMutationVariables = Exact<{
  postId: string;
}>;


export type UnbookmarkPostMutation = { unbookmarkPost: { id: string, isBookmarked: boolean, author: { id: string } | null } | null };

export type UnfollowUserMutationVariables = Exact<{
  to: string;
}>;


export type UnfollowUserMutation = { unfollowUser: { followerId: string, followingId: string } | null };

export type UnlikePostMutationVariables = Exact<{
  postId: string;
}>;


export type UnlikePostMutation = { unlikePost: { id: string, isLiked: boolean, likesCount: number, author: { id: string } | null } | null };

export type UnrepostPostMutationVariables = Exact<{
  postId: string;
}>;


export type UnrepostPostMutation = { unrepostPost: { id: string, isReposted: boolean, repostsCount: number, author: { id: string } | null } | null };

export type UpdatePostVisibilityMutationVariables = Exact<{
  postId: string;
  visibility: PostVisibility;
}>;


export type UpdatePostVisibilityMutation = { updatePostVisibility: { id: string, visibility: PostVisibility, author: { id: string } | null } };

export type UpdateProfileImageMutationVariables = Exact<{
  profileImgUrl: string;
  profileImgPublicId?: string | null | undefined;
}>;


export type UpdateProfileImageMutation = { updateProfileImage: { id: string, profileImgUrl: string | null, profileImgPublicId: string | null } | null };

export type GetAllPostsQueryVariables = Exact<{
  first: number;
  after?: string | null | undefined;
}>;


export type GetAllPostsQuery = { getAllPosts: { nextCursor: string | null, hasMore: boolean, posts: Array<{ id: string, content: string, visibility: PostVisibility, imgURL: string | null, imgURLs: Array<string>, likesCount: number, isLiked: boolean, isBookmarked: boolean, isReposted: boolean, repostsCount: number, repostOfId: string | null, commentsCount: number, threadRootId: string | null, threadPosition: number | null, threadPartCount: number, isThreadPart: boolean, createdAt: string, author: { id: string, username: string, profileImgUrl: string | null, firstName: string | null, lastName: string | null } | null, repostOf: { id: string, content: string, visibility: PostVisibility, imgURLs: Array<string>, likesCount: number, isLiked: boolean, isBookmarked: boolean, isReposted: boolean, repostsCount: number, commentsCount: number, threadRootId: string | null, threadPosition: number | null, threadPartCount: number, isThreadPart: boolean, createdAt: string, author: { id: string, username: string, profileImgUrl: string | null, firstName: string | null, lastName: string | null } | null } | null }> } };

export type GetBookmarkedPostsQueryVariables = Exact<{
  first: number;
  after?: string | null | undefined;
}>;


export type GetBookmarkedPostsQuery = { getBookmarkedPosts: { nextCursor: string | null, hasMore: boolean, posts: Array<{ id: string, content: string, visibility: PostVisibility, imgURL: string | null, imgURLs: Array<string>, likesCount: number, isLiked: boolean, isBookmarked: boolean, isReposted: boolean, repostsCount: number, repostOfId: string | null, commentsCount: number, threadRootId: string | null, threadPosition: number | null, threadPartCount: number, isThreadPart: boolean, createdAt: string, author: { id: string, username: string, profileImgUrl: string | null, firstName: string | null, lastName: string | null } | null, repostOf: { id: string, content: string, visibility: PostVisibility, imgURLs: Array<string>, likesCount: number, isLiked: boolean, isBookmarked: boolean, isReposted: boolean, repostsCount: number, commentsCount: number, threadRootId: string | null, threadPosition: number | null, threadPartCount: number, isThreadPart: boolean, createdAt: string, author: { id: string, username: string, profileImgUrl: string | null, firstName: string | null, lastName: string | null } | null } | null }> } };

export type GetCommentsQueryVariables = Exact<{
  postId: string;
}>;


export type GetCommentsQuery = { getComments: Array<{ id: string, content: string, postOwnerId: string, author: { id: string, username: string, profileImgUrl: string | null } }> };

export type GetConversationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetConversationsQuery = { getConversations: Array<{ id: string, isGroup: boolean, name: string | null, myRole: ConversationRole | null, memberCount: number, unreadCount: number, participants: Array<{ id: string, username: string, profileImgUrl: string | null }>, members: Array<{ role: ConversationRole, user: { id: string, username: string, firstName: string | null, lastName: string | null, profileImgUrl: string | null } }>, lastMessage: { id: string, content: string, createdAt: string, sender: { id: string, username: string } } | null }> };

export type GetCurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentUserQuery = { currUser: { id: string, email: string, username: string, firstName: string | null, lastName: string | null, profileImgUrl: string | null, followersCount: number, followingCount: number, posts: Array<{ id: string, content: string, visibility: PostVisibility, imgURL: string | null, imgURLs: Array<string>, createdAt: string, likesCount: number, isLiked: boolean, isBookmarked: boolean, isReposted: boolean, repostsCount: number, repostOfId: string | null, commentsCount: number, threadRootId: string | null, threadPosition: number | null, threadPartCount: number, isThreadPart: boolean, repostOf: { id: string, content: string, visibility: PostVisibility, imgURLs: Array<string>, likesCount: number, isLiked: boolean, isBookmarked: boolean, isReposted: boolean, repostsCount: number, commentsCount: number, threadRootId: string | null, threadPosition: number | null, threadPartCount: number, isThreadPart: boolean, createdAt: string, author: { id: string, username: string, profileImgUrl: string | null, firstName: string | null, lastName: string | null } | null } | null } | null> | null } | null };

export type GetMediaPostsQueryVariables = Exact<{
  first: number;
  after?: string | null | undefined;
}>;


export type GetMediaPostsQuery = { getMediaPosts: { nextCursor: string | null, hasMore: boolean, posts: Array<{ id: string, content: string, visibility: PostVisibility, imgURL: string | null, imgURLs: Array<string>, threadRootId: string | null, threadPartCount: number, isThreadPart: boolean, createdAt: string, author: { id: string, username: string, profileImgUrl: string | null } | null }> } };

export type GetMessagesQueryVariables = Exact<{
  conversationId: string;
}>;


export type GetMessagesQuery = { getMessages: Array<{ id: string, content: string, createdAt: string, sender: { id: string, username: string, firstName: string | null, lastName: string | null, profileImgUrl: string | null } }> };

export type GetNotificationsQueryVariables = Exact<{
  first?: number | null | undefined;
  after?: string | null | undefined;
  unreadOnly?: boolean | null | undefined;
}>;


export type GetNotificationsQuery = { getNotifications: { nextCursor: string | null, hasMore: boolean, notifications: Array<{ id: string, type: string, readAt: string | null, createdAt: string, actor: { id: string, username: string, profileImgUrl: string | null, firstName: string | null, lastName: string | null }, post: { id: string, content: string, createdAt: string } | null, comment: { id: string, content: string } | null }> } };

export type GetPostByIdQueryVariables = Exact<{
  postId: string;
}>;


export type GetPostByIdQuery = { getPostById: { id: string, content: string, visibility: PostVisibility, imgURL: string | null, imgURLs: Array<string>, createdAt: string, likesCount: number, isLiked: boolean, isBookmarked: boolean, isReposted: boolean, repostsCount: number, repostOfId: string | null, commentsCount: number, threadRootId: string | null, threadPosition: number | null, threadPartCount: number, isThreadPart: boolean, thread: Array<{ id: string, content: string, visibility: PostVisibility, imgURL: string | null, imgURLs: Array<string>, createdAt: string, threadRootId: string | null, threadPosition: number | null, threadPartCount: number, isThreadPart: boolean, likesCount: number, isLiked: boolean, isBookmarked: boolean, isReposted: boolean, repostsCount: number, commentsCount: number, author: { id: string, username: string, profileImgUrl: string | null, firstName: string | null, lastName: string | null } | null }>, author: { id: string, username: string, profileImgUrl: string | null, firstName: string | null, lastName: string | null } | null, repostOf: { id: string, content: string, visibility: PostVisibility, imgURLs: Array<string>, likesCount: number, isLiked: boolean, isBookmarked: boolean, isReposted: boolean, repostsCount: number, commentsCount: number, threadRootId: string | null, threadPosition: number | null, threadPartCount: number, isThreadPart: boolean, createdAt: string, author: { id: string, username: string, profileImgUrl: string | null, firstName: string | null, lastName: string | null } | null } | null } | null };

export type GetSuggestedUsersQueryVariables = Exact<{
  limit?: number | null | undefined;
}>;


export type GetSuggestedUsersQuery = { suggestedUsers: Array<{ id: string, username: string, firstName: string | null, lastName: string | null, profileImgUrl: string | null }> };

export type GetUserByUsernameQueryVariables = Exact<{
  username: string;
}>;


export type GetUserByUsernameQuery = { getUserByUsername: { id: string, email: string, username: string, firstName: string | null, lastName: string | null, profileImgUrl: string | null, isFollowing: boolean, followersCount: number, followingCount: number, posts: Array<{ id: string, content: string, visibility: PostVisibility, imgURL: string | null, imgURLs: Array<string>, createdAt: string, likesCount: number, isLiked: boolean, isBookmarked: boolean, isReposted: boolean, repostsCount: number, repostOfId: string | null, commentsCount: number, threadRootId: string | null, threadPosition: number | null, threadPartCount: number, isThreadPart: boolean, repostOf: { id: string, content: string, visibility: PostVisibility, imgURLs: Array<string>, likesCount: number, isLiked: boolean, isBookmarked: boolean, isReposted: boolean, repostsCount: number, commentsCount: number, threadRootId: string | null, threadPosition: number | null, threadPartCount: number, isThreadPart: boolean, createdAt: string, author: { id: string, username: string, profileImgUrl: string | null, firstName: string | null, lastName: string | null } | null } | null } | null> | null } | null };

export type GetUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUsersQuery = { users: Array<{ id: string, email: string, username: string, profileImgUrl: string | null } | null> };

export type SearchUsersQueryVariables = Exact<{
  keyword: string;
}>;


export type SearchUsersQuery = { searchUsers: Array<{ username: string, profileImgUrl: string | null, id: string }> };

export type UnreadMessageCountQueryVariables = Exact<{ [key: string]: never; }>;


export type UnreadMessageCountQuery = { unreadMessageCount: number };

export type UnreadNotificationCountQueryVariables = Exact<{ [key: string]: never; }>;


export type UnreadNotificationCountQuery = { unreadNotificationCount: number };

export type UnseenNotificationCountQueryVariables = Exact<{ [key: string]: never; }>;


export type UnseenNotificationCountQuery = { unseenNotificationCount: number };

export type GetMeQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMeQuery = { currUser: { id: string, email: string } | null };



export const AddGroupMembersDocument = new TypedDocumentString(`
    mutation AddGroupMembers($conversationId: String!, $userIds: [String!]!) {
  addGroupMembers(conversationId: $conversationId, userIds: $userIds) {
    id
    memberCount
  }
}
    `);

export const useAddGroupMembersMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<AddGroupMembersMutation, TError, AddGroupMembersMutationVariables, TContext>) => {
    
    return useMutation<AddGroupMembersMutation, TError, AddGroupMembersMutationVariables, TContext>(
      {
    mutationKey: ['AddGroupMembers'],
    mutationFn: (variables?: AddGroupMembersMutationVariables) => useCustomFetcher<AddGroupMembersMutation, AddGroupMembersMutationVariables>(AddGroupMembersDocument, variables)(),
    ...options
  }
    )};

export const AppendThreadPartDocument = new TypedDocumentString(`
    mutation AppendThreadPart($postId: String!, $payload: CreateThreadPartPayload!) {
  appendThreadPart(postId: $postId, payload: $payload) {
    id
    content
    visibility
    imgURL
    imgURLs
    threadRootId
    threadPosition
    createdAt
    author {
      id
      username
      profileImgUrl
      firstName
      lastName
    }
  }
}
    `);

export const useAppendThreadPartMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<AppendThreadPartMutation, TError, AppendThreadPartMutationVariables, TContext>) => {
    
    return useMutation<AppendThreadPartMutation, TError, AppendThreadPartMutationVariables, TContext>(
      {
    mutationKey: ['AppendThreadPart'],
    mutationFn: (variables?: AppendThreadPartMutationVariables) => useCustomFetcher<AppendThreadPartMutation, AppendThreadPartMutationVariables>(AppendThreadPartDocument, variables)(),
    ...options
  }
    )};

export const BookmarkPostDocument = new TypedDocumentString(`
    mutation BookmarkPost($postId: String!) {
  bookmarkPost(postId: $postId) {
    id
    isBookmarked
    author {
      id
    }
  }
}
    `);

export const useBookmarkPostMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<BookmarkPostMutation, TError, BookmarkPostMutationVariables, TContext>) => {
    
    return useMutation<BookmarkPostMutation, TError, BookmarkPostMutationVariables, TContext>(
      {
    mutationKey: ['BookmarkPost'],
    mutationFn: (variables?: BookmarkPostMutationVariables) => useCustomFetcher<BookmarkPostMutation, BookmarkPostMutationVariables>(BookmarkPostDocument, variables)(),
    ...options
  }
    )};

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

export const CreateGroupConversationDocument = new TypedDocumentString(`
    mutation CreateGroupConversation($name: String!, $participantIds: [String!]!) {
  createGroupConversation(name: $name, participantIds: $participantIds) {
    id
    isGroup
    name
    myRole
    memberCount
  }
}
    `);

export const useCreateGroupConversationMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreateGroupConversationMutation, TError, CreateGroupConversationMutationVariables, TContext>) => {
    
    return useMutation<CreateGroupConversationMutation, TError, CreateGroupConversationMutationVariables, TContext>(
      {
    mutationKey: ['CreateGroupConversation'],
    mutationFn: (variables?: CreateGroupConversationMutationVariables) => useCustomFetcher<CreateGroupConversationMutation, CreateGroupConversationMutationVariables>(CreateGroupConversationDocument, variables)(),
    ...options
  }
    )};

export const CreatePostDocument = new TypedDocumentString(`
    mutation CreatePost($payload: CreatePostPayload!) {
  createPost(payload: $payload) {
    id
    content
    visibility
    imgURL
    imgURLs
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

export const DeleteCommentDocument = new TypedDocumentString(`
    mutation DeleteComment($commentId: String!) {
  deleteComment(commentId: $commentId)
}
    `);

export const useDeleteCommentMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DeleteCommentMutation, TError, DeleteCommentMutationVariables, TContext>) => {
    
    return useMutation<DeleteCommentMutation, TError, DeleteCommentMutationVariables, TContext>(
      {
    mutationKey: ['DeleteComment'],
    mutationFn: (variables?: DeleteCommentMutationVariables) => useCustomFetcher<DeleteCommentMutation, DeleteCommentMutationVariables>(DeleteCommentDocument, variables)(),
    ...options
  }
    )};

export const DeleteGroupDocument = new TypedDocumentString(`
    mutation DeleteGroup($conversationId: String!) {
  deleteGroup(conversationId: $conversationId)
}
    `);

export const useDeleteGroupMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DeleteGroupMutation, TError, DeleteGroupMutationVariables, TContext>) => {
    
    return useMutation<DeleteGroupMutation, TError, DeleteGroupMutationVariables, TContext>(
      {
    mutationKey: ['DeleteGroup'],
    mutationFn: (variables?: DeleteGroupMutationVariables) => useCustomFetcher<DeleteGroupMutation, DeleteGroupMutationVariables>(DeleteGroupDocument, variables)(),
    ...options
  }
    )};

export const DeletePostDocument = new TypedDocumentString(`
    mutation DeletePost($postId: String!) {
  deletePost(postId: $postId)
}
    `);

export const useDeletePostMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DeletePostMutation, TError, DeletePostMutationVariables, TContext>) => {
    
    return useMutation<DeletePostMutation, TError, DeletePostMutationVariables, TContext>(
      {
    mutationKey: ['DeletePost'],
    mutationFn: (variables?: DeletePostMutationVariables) => useCustomFetcher<DeletePostMutation, DeletePostMutationVariables>(DeletePostDocument, variables)(),
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

export const DeleteThreadPartDocument = new TypedDocumentString(`
    mutation DeleteThreadPart($postId: String!) {
  deleteThreadPart(postId: $postId)
}
    `);

export const useDeleteThreadPartMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DeleteThreadPartMutation, TError, DeleteThreadPartMutationVariables, TContext>) => {
    
    return useMutation<DeleteThreadPartMutation, TError, DeleteThreadPartMutationVariables, TContext>(
      {
    mutationKey: ['DeleteThreadPart'],
    mutationFn: (variables?: DeleteThreadPartMutationVariables) => useCustomFetcher<DeleteThreadPartMutation, DeleteThreadPartMutationVariables>(DeleteThreadPartDocument, variables)(),
    ...options
  }
    )};

export const EditPostDocument = new TypedDocumentString(`
    mutation EditPost($payload: EditPostPayload!) {
  editPost(payload: $payload) {
    id
    content
    visibility
    imgURL
    imgURLs
    createdAt
    updatedAt
    author {
      id
      username
    }
  }
}
    `);

export const useEditPostMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<EditPostMutation, TError, EditPostMutationVariables, TContext>) => {
    
    return useMutation<EditPostMutation, TError, EditPostMutationVariables, TContext>(
      {
    mutationKey: ['EditPost'],
    mutationFn: (variables?: EditPostMutationVariables) => useCustomFetcher<EditPostMutation, EditPostMutationVariables>(EditPostDocument, variables)(),
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

export const LeaveGroupDocument = new TypedDocumentString(`
    mutation LeaveGroup($conversationId: String!) {
  leaveGroup(conversationId: $conversationId)
}
    `);

export const useLeaveGroupMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<LeaveGroupMutation, TError, LeaveGroupMutationVariables, TContext>) => {
    
    return useMutation<LeaveGroupMutation, TError, LeaveGroupMutationVariables, TContext>(
      {
    mutationKey: ['LeaveGroup'],
    mutationFn: (variables?: LeaveGroupMutationVariables) => useCustomFetcher<LeaveGroupMutation, LeaveGroupMutationVariables>(LeaveGroupDocument, variables)(),
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

export const MarkAllNotificationsReadDocument = new TypedDocumentString(`
    mutation MarkAllNotificationsRead {
  markAllNotificationsRead
}
    `);

export const useMarkAllNotificationsReadMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<MarkAllNotificationsReadMutation, TError, MarkAllNotificationsReadMutationVariables, TContext>) => {
    
    return useMutation<MarkAllNotificationsReadMutation, TError, MarkAllNotificationsReadMutationVariables, TContext>(
      {
    mutationKey: ['MarkAllNotificationsRead'],
    mutationFn: (variables?: MarkAllNotificationsReadMutationVariables) => useCustomFetcher<MarkAllNotificationsReadMutation, MarkAllNotificationsReadMutationVariables>(MarkAllNotificationsReadDocument, variables)(),
    ...options
  }
    )};

export const MarkConversationReadDocument = new TypedDocumentString(`
    mutation MarkConversationRead($conversationId: String!) {
  markConversationRead(conversationId: $conversationId)
}
    `);

export const useMarkConversationReadMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<MarkConversationReadMutation, TError, MarkConversationReadMutationVariables, TContext>) => {
    
    return useMutation<MarkConversationReadMutation, TError, MarkConversationReadMutationVariables, TContext>(
      {
    mutationKey: ['MarkConversationRead'],
    mutationFn: (variables?: MarkConversationReadMutationVariables) => useCustomFetcher<MarkConversationReadMutation, MarkConversationReadMutationVariables>(MarkConversationReadDocument, variables)(),
    ...options
  }
    )};

export const MarkNotificationReadDocument = new TypedDocumentString(`
    mutation MarkNotificationRead($notificationId: String!) {
  markNotificationRead(notificationId: $notificationId)
}
    `);

export const useMarkNotificationReadMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<MarkNotificationReadMutation, TError, MarkNotificationReadMutationVariables, TContext>) => {
    
    return useMutation<MarkNotificationReadMutation, TError, MarkNotificationReadMutationVariables, TContext>(
      {
    mutationKey: ['MarkNotificationRead'],
    mutationFn: (variables?: MarkNotificationReadMutationVariables) => useCustomFetcher<MarkNotificationReadMutation, MarkNotificationReadMutationVariables>(MarkNotificationReadDocument, variables)(),
    ...options
  }
    )};

export const MarkNotificationsSeenDocument = new TypedDocumentString(`
    mutation MarkNotificationsSeen {
  markNotificationsSeen
}
    `);

export const useMarkNotificationsSeenMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<MarkNotificationsSeenMutation, TError, MarkNotificationsSeenMutationVariables, TContext>) => {
    
    return useMutation<MarkNotificationsSeenMutation, TError, MarkNotificationsSeenMutationVariables, TContext>(
      {
    mutationKey: ['MarkNotificationsSeen'],
    mutationFn: (variables?: MarkNotificationsSeenMutationVariables) => useCustomFetcher<MarkNotificationsSeenMutation, MarkNotificationsSeenMutationVariables>(MarkNotificationsSeenDocument, variables)(),
    ...options
  }
    )};

export const RemoveGroupMemberDocument = new TypedDocumentString(`
    mutation RemoveGroupMember($conversationId: String!, $userId: String!) {
  removeGroupMember(conversationId: $conversationId, userId: $userId)
}
    `);

export const useRemoveGroupMemberMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<RemoveGroupMemberMutation, TError, RemoveGroupMemberMutationVariables, TContext>) => {
    
    return useMutation<RemoveGroupMemberMutation, TError, RemoveGroupMemberMutationVariables, TContext>(
      {
    mutationKey: ['RemoveGroupMember'],
    mutationFn: (variables?: RemoveGroupMemberMutationVariables) => useCustomFetcher<RemoveGroupMemberMutation, RemoveGroupMemberMutationVariables>(RemoveGroupMemberDocument, variables)(),
    ...options
  }
    )};

export const RenameGroupDocument = new TypedDocumentString(`
    mutation RenameGroup($conversationId: String!, $name: String!) {
  renameGroup(conversationId: $conversationId, name: $name) {
    id
    name
  }
}
    `);

export const useRenameGroupMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<RenameGroupMutation, TError, RenameGroupMutationVariables, TContext>) => {
    
    return useMutation<RenameGroupMutation, TError, RenameGroupMutationVariables, TContext>(
      {
    mutationKey: ['RenameGroup'],
    mutationFn: (variables?: RenameGroupMutationVariables) => useCustomFetcher<RenameGroupMutation, RenameGroupMutationVariables>(RenameGroupDocument, variables)(),
    ...options
  }
    )};

export const RepostPostDocument = new TypedDocumentString(`
    mutation RepostPost($postId: String!) {
  repostPost(postId: $postId) {
    id
    isReposted
    repostsCount
    author {
      id
    }
  }
}
    `);

export const useRepostPostMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<RepostPostMutation, TError, RepostPostMutationVariables, TContext>) => {
    
    return useMutation<RepostPostMutation, TError, RepostPostMutationVariables, TContext>(
      {
    mutationKey: ['RepostPost'],
    mutationFn: (variables?: RepostPostMutationVariables) => useCustomFetcher<RepostPostMutation, RepostPostMutationVariables>(RepostPostDocument, variables)(),
    ...options
  }
    )};

export const RequestAccountDeletionDocument = new TypedDocumentString(`
    mutation RequestAccountDeletion {
  requestAccountDeletion
}
    `);

export const useRequestAccountDeletionMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<RequestAccountDeletionMutation, TError, RequestAccountDeletionMutationVariables, TContext>) => {
    
    return useMutation<RequestAccountDeletionMutation, TError, RequestAccountDeletionMutationVariables, TContext>(
      {
    mutationKey: ['RequestAccountDeletion'],
    mutationFn: (variables?: RequestAccountDeletionMutationVariables) => useCustomFetcher<RequestAccountDeletionMutation, RequestAccountDeletionMutationVariables>(RequestAccountDeletionDocument, variables)(),
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

export const SetMemberRoleDocument = new TypedDocumentString(`
    mutation SetMemberRole($conversationId: String!, $userId: String!, $role: ConversationRole!) {
  setMemberRole(conversationId: $conversationId, userId: $userId, role: $role)
}
    `);

export const useSetMemberRoleMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<SetMemberRoleMutation, TError, SetMemberRoleMutationVariables, TContext>) => {
    
    return useMutation<SetMemberRoleMutation, TError, SetMemberRoleMutationVariables, TContext>(
      {
    mutationKey: ['SetMemberRole'],
    mutationFn: (variables?: SetMemberRoleMutationVariables) => useCustomFetcher<SetMemberRoleMutation, SetMemberRoleMutationVariables>(SetMemberRoleDocument, variables)(),
    ...options
  }
    )};

export const TransferOwnershipDocument = new TypedDocumentString(`
    mutation TransferOwnership($conversationId: String!, $userId: String!) {
  transferOwnership(conversationId: $conversationId, userId: $userId)
}
    `);

export const useTransferOwnershipMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<TransferOwnershipMutation, TError, TransferOwnershipMutationVariables, TContext>) => {
    
    return useMutation<TransferOwnershipMutation, TError, TransferOwnershipMutationVariables, TContext>(
      {
    mutationKey: ['TransferOwnership'],
    mutationFn: (variables?: TransferOwnershipMutationVariables) => useCustomFetcher<TransferOwnershipMutation, TransferOwnershipMutationVariables>(TransferOwnershipDocument, variables)(),
    ...options
  }
    )};

export const UnbookmarkPostDocument = new TypedDocumentString(`
    mutation UnbookmarkPost($postId: String!) {
  unbookmarkPost(postId: $postId) {
    id
    isBookmarked
    author {
      id
    }
  }
}
    `);

export const useUnbookmarkPostMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UnbookmarkPostMutation, TError, UnbookmarkPostMutationVariables, TContext>) => {
    
    return useMutation<UnbookmarkPostMutation, TError, UnbookmarkPostMutationVariables, TContext>(
      {
    mutationKey: ['UnbookmarkPost'],
    mutationFn: (variables?: UnbookmarkPostMutationVariables) => useCustomFetcher<UnbookmarkPostMutation, UnbookmarkPostMutationVariables>(UnbookmarkPostDocument, variables)(),
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

export const UnrepostPostDocument = new TypedDocumentString(`
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
    `);

export const useUnrepostPostMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UnrepostPostMutation, TError, UnrepostPostMutationVariables, TContext>) => {
    
    return useMutation<UnrepostPostMutation, TError, UnrepostPostMutationVariables, TContext>(
      {
    mutationKey: ['UnrepostPost'],
    mutationFn: (variables?: UnrepostPostMutationVariables) => useCustomFetcher<UnrepostPostMutation, UnrepostPostMutationVariables>(UnrepostPostDocument, variables)(),
    ...options
  }
    )};

export const UpdatePostVisibilityDocument = new TypedDocumentString(`
    mutation UpdatePostVisibility($postId: String!, $visibility: PostVisibility!) {
  updatePostVisibility(postId: $postId, visibility: $visibility) {
    id
    visibility
    author {
      id
    }
  }
}
    `);

export const useUpdatePostVisibilityMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdatePostVisibilityMutation, TError, UpdatePostVisibilityMutationVariables, TContext>) => {
    
    return useMutation<UpdatePostVisibilityMutation, TError, UpdatePostVisibilityMutationVariables, TContext>(
      {
    mutationKey: ['UpdatePostVisibility'],
    mutationFn: (variables?: UpdatePostVisibilityMutationVariables) => useCustomFetcher<UpdatePostVisibilityMutation, UpdatePostVisibilityMutationVariables>(UpdatePostVisibilityDocument, variables)(),
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
    query GetAllPosts($first: Int!, $after: String) {
  getAllPosts(first: $first, after: $after) {
    posts {
      id
      content
      visibility
      imgURL
      imgURLs
      likesCount
      isLiked
      isBookmarked
      isReposted
      repostsCount
      repostOfId
      commentsCount
      threadRootId
      threadPosition
      threadPartCount
      isThreadPart
      createdAt
      author {
        id
        username
        profileImgUrl
        firstName
        lastName
      }
      repostOf {
        id
        content
        visibility
        imgURLs
        likesCount
        isLiked
        isBookmarked
        isReposted
        repostsCount
        commentsCount
        threadRootId
        threadPosition
        threadPartCount
        isThreadPart
        createdAt
        author {
          id
          username
          profileImgUrl
          firstName
          lastName
        }
      }
    }
    nextCursor
    hasMore
  }
}
    `);

export const useGetAllPostsQuery = <
      TData = GetAllPostsQuery,
      TError = unknown
    >(
      variables: GetAllPostsQueryVariables,
      options?: Omit<UseQueryOptions<GetAllPostsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetAllPostsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetAllPostsQuery, TError, TData>(
      {
    queryKey: ['GetAllPosts', variables],
    queryFn: useCustomFetcher<GetAllPostsQuery, GetAllPostsQueryVariables>(GetAllPostsDocument, variables),
    ...options
  }
    )};

useGetAllPostsQuery.getKey = (variables: GetAllPostsQueryVariables) => ['GetAllPosts', variables];

export const GetBookmarkedPostsDocument = new TypedDocumentString(`
    query GetBookmarkedPosts($first: Int!, $after: String) {
  getBookmarkedPosts(first: $first, after: $after) {
    posts {
      id
      content
      visibility
      imgURL
      imgURLs
      likesCount
      isLiked
      isBookmarked
      isReposted
      repostsCount
      repostOfId
      commentsCount
      threadRootId
      threadPosition
      threadPartCount
      isThreadPart
      createdAt
      author {
        id
        username
        profileImgUrl
        firstName
        lastName
      }
      repostOf {
        id
        content
        visibility
        imgURLs
        likesCount
        isLiked
        isBookmarked
        isReposted
        repostsCount
        commentsCount
        threadRootId
        threadPosition
        threadPartCount
        isThreadPart
        createdAt
        author {
          id
          username
          profileImgUrl
          firstName
          lastName
        }
      }
    }
    nextCursor
    hasMore
  }
}
    `);

export const useGetBookmarkedPostsQuery = <
      TData = GetBookmarkedPostsQuery,
      TError = unknown
    >(
      variables: GetBookmarkedPostsQueryVariables,
      options?: Omit<UseQueryOptions<GetBookmarkedPostsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetBookmarkedPostsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetBookmarkedPostsQuery, TError, TData>(
      {
    queryKey: ['GetBookmarkedPosts', variables],
    queryFn: useCustomFetcher<GetBookmarkedPostsQuery, GetBookmarkedPostsQueryVariables>(GetBookmarkedPostsDocument, variables),
    ...options
  }
    )};

useGetBookmarkedPostsQuery.getKey = (variables: GetBookmarkedPostsQueryVariables) => ['GetBookmarkedPosts', variables];

export const GetCommentsDocument = new TypedDocumentString(`
    query GetComments($postId: String!) {
  getComments(postId: $postId) {
    id
    content
    postOwnerId
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
    isGroup
    name
    myRole
    memberCount
    unreadCount
    participants {
      id
      username
      profileImgUrl
    }
    members {
      role
      user {
        id
        username
        firstName
        lastName
        profileImgUrl
      }
    }
    lastMessage {
      id
      content
      createdAt
      sender {
        id
        username
      }
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
    firstName
    lastName
    profileImgUrl
    followersCount
    followingCount
    posts {
      id
      content
      visibility
      imgURL
      imgURLs
      createdAt
      likesCount
      isLiked
      isBookmarked
      isReposted
      repostsCount
      repostOfId
      commentsCount
      threadRootId
      threadPosition
      threadPartCount
      isThreadPart
      repostOf {
        id
        content
        visibility
        imgURLs
        likesCount
        isLiked
        isBookmarked
        isReposted
        repostsCount
        commentsCount
        threadRootId
        threadPosition
        threadPartCount
        isThreadPart
        createdAt
        author {
          id
          username
          profileImgUrl
          firstName
          lastName
        }
      }
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

export const GetMediaPostsDocument = new TypedDocumentString(`
    query GetMediaPosts($first: Int!, $after: String) {
  getMediaPosts(first: $first, after: $after) {
    posts {
      id
      content
      visibility
      imgURL
      imgURLs
      threadRootId
      threadPartCount
      isThreadPart
      createdAt
      author {
        id
        username
        profileImgUrl
      }
    }
    nextCursor
    hasMore
  }
}
    `);

export const useGetMediaPostsQuery = <
      TData = GetMediaPostsQuery,
      TError = unknown
    >(
      variables: GetMediaPostsQueryVariables,
      options?: Omit<UseQueryOptions<GetMediaPostsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetMediaPostsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetMediaPostsQuery, TError, TData>(
      {
    queryKey: ['GetMediaPosts', variables],
    queryFn: useCustomFetcher<GetMediaPostsQuery, GetMediaPostsQueryVariables>(GetMediaPostsDocument, variables),
    ...options
  }
    )};

useGetMediaPostsQuery.getKey = (variables: GetMediaPostsQueryVariables) => ['GetMediaPosts', variables];

export const GetMessagesDocument = new TypedDocumentString(`
    query GetMessages($conversationId: String!) {
  getMessages(conversationId: $conversationId) {
    id
    content
    createdAt
    sender {
      id
      username
      firstName
      lastName
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

export const GetNotificationsDocument = new TypedDocumentString(`
    query GetNotifications($first: Int, $after: String, $unreadOnly: Boolean) {
  getNotifications(first: $first, after: $after, unreadOnly: $unreadOnly) {
    notifications {
      id
      type
      readAt
      createdAt
      actor {
        id
        username
        profileImgUrl
        firstName
        lastName
      }
      post {
        id
        content
        createdAt
      }
      comment {
        id
        content
      }
    }
    nextCursor
    hasMore
  }
}
    `);

export const useGetNotificationsQuery = <
      TData = GetNotificationsQuery,
      TError = unknown
    >(
      variables?: GetNotificationsQueryVariables,
      options?: Omit<UseQueryOptions<GetNotificationsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetNotificationsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetNotificationsQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['GetNotifications'] : ['GetNotifications', variables],
    queryFn: useCustomFetcher<GetNotificationsQuery, GetNotificationsQueryVariables>(GetNotificationsDocument, variables),
    ...options
  }
    )};

useGetNotificationsQuery.getKey = (variables?: GetNotificationsQueryVariables) => variables === undefined ? ['GetNotifications'] : ['GetNotifications', variables];

export const GetPostByIdDocument = new TypedDocumentString(`
    query GetPostById($postId: String!) {
  getPostById(postId: $postId) {
    id
    content
    visibility
    imgURL
    imgURLs
    createdAt
    likesCount
    isLiked
    isBookmarked
    isReposted
    repostsCount
    repostOfId
    commentsCount
    threadRootId
    threadPosition
    threadPartCount
    isThreadPart
    thread {
      id
      content
      visibility
      imgURL
      imgURLs
      createdAt
      threadRootId
      threadPosition
      threadPartCount
      isThreadPart
      likesCount
      isLiked
      isBookmarked
      isReposted
      repostsCount
      commentsCount
      author {
        id
        username
        profileImgUrl
        firstName
        lastName
      }
    }
    author {
      id
      username
      profileImgUrl
      firstName
      lastName
    }
    repostOf {
      id
      content
      visibility
      imgURLs
      likesCount
      isLiked
      isBookmarked
      isReposted
      repostsCount
      commentsCount
      threadRootId
      threadPosition
      threadPartCount
      isThreadPart
      createdAt
      author {
        id
        username
        profileImgUrl
        firstName
        lastName
      }
    }
  }
}
    `);

export const useGetPostByIdQuery = <
      TData = GetPostByIdQuery,
      TError = unknown
    >(
      variables: GetPostByIdQueryVariables,
      options?: Omit<UseQueryOptions<GetPostByIdQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetPostByIdQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetPostByIdQuery, TError, TData>(
      {
    queryKey: ['GetPostById', variables],
    queryFn: useCustomFetcher<GetPostByIdQuery, GetPostByIdQueryVariables>(GetPostByIdDocument, variables),
    ...options
  }
    )};

useGetPostByIdQuery.getKey = (variables: GetPostByIdQueryVariables) => ['GetPostById', variables];

export const GetSuggestedUsersDocument = new TypedDocumentString(`
    query GetSuggestedUsers($limit: Int) {
  suggestedUsers(limit: $limit) {
    id
    username
    firstName
    lastName
    profileImgUrl
  }
}
    `);

export const useGetSuggestedUsersQuery = <
      TData = GetSuggestedUsersQuery,
      TError = unknown
    >(
      variables?: GetSuggestedUsersQueryVariables,
      options?: Omit<UseQueryOptions<GetSuggestedUsersQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetSuggestedUsersQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetSuggestedUsersQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['GetSuggestedUsers'] : ['GetSuggestedUsers', variables],
    queryFn: useCustomFetcher<GetSuggestedUsersQuery, GetSuggestedUsersQueryVariables>(GetSuggestedUsersDocument, variables),
    ...options
  }
    )};

useGetSuggestedUsersQuery.getKey = (variables?: GetSuggestedUsersQueryVariables) => variables === undefined ? ['GetSuggestedUsers'] : ['GetSuggestedUsers', variables];

export const GetUserByUsernameDocument = new TypedDocumentString(`
    query GetUserByUsername($username: String!) {
  getUserByUsername(username: $username) {
    id
    email
    username
    firstName
    lastName
    profileImgUrl
    isFollowing
    followersCount
    followingCount
    posts {
      id
      content
      visibility
      imgURL
      imgURLs
      createdAt
      likesCount
      isLiked
      isBookmarked
      isReposted
      repostsCount
      repostOfId
      commentsCount
      threadRootId
      threadPosition
      threadPartCount
      isThreadPart
      repostOf {
        id
        content
        visibility
        imgURLs
        likesCount
        isLiked
        isBookmarked
        isReposted
        repostsCount
        commentsCount
        threadRootId
        threadPosition
        threadPartCount
        isThreadPart
        createdAt
        author {
          id
          username
          profileImgUrl
          firstName
          lastName
        }
      }
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

export const SearchUsersDocument = new TypedDocumentString(`
    query SearchUsers($keyword: String!) {
  searchUsers(keyword: $keyword) {
    username
    profileImgUrl
    id
  }
}
    `);

export const useSearchUsersQuery = <
      TData = SearchUsersQuery,
      TError = unknown
    >(
      variables: SearchUsersQueryVariables,
      options?: Omit<UseQueryOptions<SearchUsersQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<SearchUsersQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<SearchUsersQuery, TError, TData>(
      {
    queryKey: ['SearchUsers', variables],
    queryFn: useCustomFetcher<SearchUsersQuery, SearchUsersQueryVariables>(SearchUsersDocument, variables),
    ...options
  }
    )};

useSearchUsersQuery.getKey = (variables: SearchUsersQueryVariables) => ['SearchUsers', variables];

export const UnreadMessageCountDocument = new TypedDocumentString(`
    query UnreadMessageCount {
  unreadMessageCount
}
    `);

export const useUnreadMessageCountQuery = <
      TData = UnreadMessageCountQuery,
      TError = unknown
    >(
      variables?: UnreadMessageCountQueryVariables,
      options?: Omit<UseQueryOptions<UnreadMessageCountQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<UnreadMessageCountQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<UnreadMessageCountQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['UnreadMessageCount'] : ['UnreadMessageCount', variables],
    queryFn: useCustomFetcher<UnreadMessageCountQuery, UnreadMessageCountQueryVariables>(UnreadMessageCountDocument, variables),
    ...options
  }
    )};

useUnreadMessageCountQuery.getKey = (variables?: UnreadMessageCountQueryVariables) => variables === undefined ? ['UnreadMessageCount'] : ['UnreadMessageCount', variables];

export const UnreadNotificationCountDocument = new TypedDocumentString(`
    query UnreadNotificationCount {
  unreadNotificationCount
}
    `);

export const useUnreadNotificationCountQuery = <
      TData = UnreadNotificationCountQuery,
      TError = unknown
    >(
      variables?: UnreadNotificationCountQueryVariables,
      options?: Omit<UseQueryOptions<UnreadNotificationCountQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<UnreadNotificationCountQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<UnreadNotificationCountQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['UnreadNotificationCount'] : ['UnreadNotificationCount', variables],
    queryFn: useCustomFetcher<UnreadNotificationCountQuery, UnreadNotificationCountQueryVariables>(UnreadNotificationCountDocument, variables),
    ...options
  }
    )};

useUnreadNotificationCountQuery.getKey = (variables?: UnreadNotificationCountQueryVariables) => variables === undefined ? ['UnreadNotificationCount'] : ['UnreadNotificationCount', variables];

export const UnseenNotificationCountDocument = new TypedDocumentString(`
    query UnseenNotificationCount {
  unseenNotificationCount
}
    `);

export const useUnseenNotificationCountQuery = <
      TData = UnseenNotificationCountQuery,
      TError = unknown
    >(
      variables?: UnseenNotificationCountQueryVariables,
      options?: Omit<UseQueryOptions<UnseenNotificationCountQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<UnseenNotificationCountQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<UnseenNotificationCountQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['UnseenNotificationCount'] : ['UnseenNotificationCount', variables],
    queryFn: useCustomFetcher<UnseenNotificationCountQuery, UnseenNotificationCountQueryVariables>(UnseenNotificationCountDocument, variables),
    ...options
  }
    )};

useUnseenNotificationCountQuery.getKey = (variables?: UnseenNotificationCountQueryVariables) => variables === undefined ? ['UnseenNotificationCount'] : ['UnseenNotificationCount', variables];

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
