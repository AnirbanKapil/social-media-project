"use client"

import { Publish } from "@/app/src/components/publish";
import { Feeds } from "@/app/src/components/feeds";
import { GetAllPostsDocument, type GetAllPostsQuery, type GetAllPostsQueryVariables } from "@/lib/generated";
import { Loader } from "@/app/src/components/loader";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchGraphQL } from "@/lib/fetcher";

export default function FeedsPage () {
    const {
      data,
      isLoading,
      error,
      hasNextPage,
      isFetchingNextPage,
      isFetchNextPageError,
      fetchNextPage,
    } = useInfiniteQuery({
      queryKey: ["GetAllPosts"],
      queryFn: ({ pageParam }) => fetchGraphQL<GetAllPostsQuery, GetAllPostsQueryVariables>(
        GetAllPostsDocument.toString(),
        { first: 10, after: pageParam },
      ),
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage) => lastPage.getAllPosts.nextCursor ?? undefined,
      staleTime: 1000 * 60,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    });
    if (isLoading) return <Loader />;

    if (error && !data) {
      const err = error as Error;
        return <p>Error: {err.message}</p>;
    } 
         
    const posts = data?.pages.flatMap((page) => page.getAllPosts.posts) ?? [];
    
    return (
          <div className="mt-16 mb-10">
                    <Publish />
                     {posts.map((post) => (
                        <Feeds key={post?.id} 
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
                        commentsCount={post?.commentsCount}
                        />
                     ))}
                     {posts.length === 0 && <p className="p-4 text-center text-gray-400">No posts yet.</p>}
                     {hasNextPage && (
                       <div className="flex flex-col items-center gap-2 p-4">
                         {isFetchNextPageError && (
                           <p role="alert" className="text-sm text-red-400">
                             Could not load more posts. Please try again.
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
    )
}