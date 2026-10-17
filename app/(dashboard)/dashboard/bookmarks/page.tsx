"use client"

import { Feeds } from "@/app/src/components/feeds";
import { Loader } from "@/app/src/components/loader";
import {
  GetBookmarkedPostsDocument,
  type GetBookmarkedPostsQuery,
  type GetBookmarkedPostsQueryVariables,
} from "@/lib/generated";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchGraphQL } from "@/lib/fetcher";

export default function BookmarksPage() {
  const {
    data,
    isLoading,
    error,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["GetBookmarkedPosts"],
    queryFn: ({ pageParam }) =>
      fetchGraphQL<GetBookmarkedPostsQuery, GetBookmarkedPostsQueryVariables>(
        GetBookmarkedPostsDocument.toString(),
        { first: 10, after: pageParam },
      ),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.getBookmarkedPosts.nextCursor ?? undefined,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });

  if (isLoading) return <Loader />;

  if (error && !data) {
    const err = error as Error;
    return <p>Error: {err.message}</p>;
  }

  const posts = data?.pages.flatMap((page) => page.getBookmarkedPosts.posts) ?? [];

  return (
    <div className="mt-16 mb-10">
      <h1 className="border-b border-gray-600 px-4 py-3 text-xl font-semibold">Bookmarks</h1>
      {posts.map((post) => (
        <Feeds
          key={post?.id}
          id={post?.id || ""}
          userImg={post?.author?.profileImgUrl}
          content={post?.content || "No content available"}
          user={post?.author?.username || "Unknown User"}
          firstName={post?.author?.firstName ?? undefined}
          lastName={post?.author?.lastName ?? undefined}
          imgSrcs={post?.imgURLs ?? []}
          created={post?.createdAt || "unknown"}
          likesCount={post?.likesCount}
          isLiked={post?.isLiked}
          isBookmarked={post?.isBookmarked}
          isReposted={post?.isReposted}
          repostsCount={post?.repostsCount}
          repostOf={post?.repostOf}
          commentsCount={post?.commentsCount}
        />
      ))}
      {posts.length === 0 && (
        <p className="p-4 text-center text-gray-400">No bookmarks yet.</p>
      )}
      {hasNextPage && (
        <div className="flex flex-col items-center gap-2 p-4">
          {isFetchNextPageError && (
            <p role="alert" className="text-sm text-red-400">
              Could not load more bookmarks. Please try again.
            </p>
          )}
          <button
            type="button"
            onClick={() => void fetchNextPage()}
            disabled={isFetchingNextPage}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
          >
            {isFetchingNextPage ? "Loading..." : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
}
