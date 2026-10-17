"use client"

import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchGraphQL } from "@/lib/fetcher";
import {
  GetMediaPostsDocument,
  type GetMediaPostsQuery,
  type GetMediaPostsQueryVariables,
} from "@/lib/generated";
import { PhotoGrid } from "@/app/src/components/photoGrid";
import { Loader } from "@/app/src/components/loader";

export default function ExplorePage() {
  const {
    data,
    isLoading,
    error,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["GetMediaPosts"],
    queryFn: ({ pageParam }) =>
      fetchGraphQL<GetMediaPostsQuery, GetMediaPostsQueryVariables>(
        GetMediaPostsDocument.toString(),
        { first: 10, after: pageParam },
      ),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.getMediaPosts.nextCursor ?? undefined,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });

  if (isLoading) return <Loader />;

  if (error && !data) {
    const err = error as Error;
    return <p>Error: {err.message}</p>;
  }

  const posts = data?.pages.flatMap((page) => page.getMediaPosts.posts) ?? [];

  return (
    <div className="mt-16 mb-10">
      <h1 className="border-b border-gray-600 px-4 py-3 text-xl font-semibold">Explore</h1>
      {posts.length === 0 ? (
        <p className="p-4 text-center text-gray-400">No photos yet.</p>
      ) : (
        <div className="p-2">
          <PhotoGrid posts={posts} />
        </div>
      )}
      {hasNextPage && (
        <div className="flex flex-col items-center gap-2 p-4">
          {isFetchNextPageError && (
            <p role="alert" className="text-sm text-red-400">
              Could not load more photos. Please try again.
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
