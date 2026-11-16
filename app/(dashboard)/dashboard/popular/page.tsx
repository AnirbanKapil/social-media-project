"use client"

import { Feeds } from "@/app/src/components/feeds";
import { Loader } from "@/app/src/components/loader";
import { fetchGraphQL } from "@/lib/fetcher";
import {
  GetPopularThreadsDocument,
  type GetPopularThreadsQuery,
  type GetPopularThreadsQueryVariables,
} from "@/lib/generated";
import { useInfiniteQuery } from "@tanstack/react-query";

export default function PopularThreadsPage() {
  const {
    data,
    isLoading,
    error,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["GetPopularThreads"],
    queryFn: ({ pageParam }) =>
      fetchGraphQL<GetPopularThreadsQuery, GetPopularThreadsQueryVariables>(
        GetPopularThreadsDocument.toString(),
        { first: 10, after: pageParam },
      ),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) =>
      lastPage.getPopularThreads.nextCursor ?? undefined,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });

  if (isLoading) return <Loader />;

  if (error && !data) {
    const err = error as Error;
    return <p>Error: {err.message}</p>;
  }

  const posts = data?.pages.flatMap((page) => page.getPopularThreads.posts) ?? [];

  return (
    <div className="mt-16 mb-10">
      <div className="border-b border-gray-600 px-4 py-3">
        <h1 className="text-xl font-semibold">Popular threads</h1>
        <p className="text-sm text-slate-400">
          The most liked threads, ranked by likes.
        </p>
      </div>

      {posts.map((post) => (
        <Feeds
          key={post?.id}
          id={post?.id || ""}
          userImg={post?.author?.profileImgUrl}
          content={post?.content || "No content available"}
          visibility={post?.visibility}
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
          commentsCount={post?.commentsCount}
          threadPartCount={post?.threadPartCount}
        />
      ))}

      {posts.length === 0 && (
        <p className="p-4 text-center text-gray-400">No popular threads yet.</p>
      )}

      {hasNextPage && (
        <div className="flex flex-col items-center gap-2 p-4">
          {isFetchNextPageError && (
            <p role="alert" className="text-sm text-red-400">
              Could not load more threads. Please try again.
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
