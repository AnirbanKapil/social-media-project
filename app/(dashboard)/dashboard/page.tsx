"use client"

import { Publish } from "@/app/src/components/publish";
import { Feeds } from "@/app/src/components/feeds";
import { useGetAllPostsQuery } from "@/lib/generated";

export default function FeedsPage () {

    const { data, isLoading, error } = useGetAllPostsQuery({},
      {
      staleTime: 1000 * 60, 
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    }
    );
    if (isLoading) return (
        <div className='min-h-screen flex items-center justify-center'>
        <div className='flex flex-col items-center gap-4'>
        <div className='h-12 w-12 animate-spin rounded-full border-4 border-white border-t-transparent'></div>
        <p className='text-white text-lg font-medium'>Loading...</p>
        </div>
        </div>
    );

    
    if (error) {
      const err = error as Error;
        return <p>Error: {err.message}</p>;
    } 
         
    const posts = data?.getAllPosts;
    
    if (!posts) return <p>No data</p>;

    return (
          <div className="mt-16 mb-10">
                    <Publish />
                     {posts.map((post) => (
                        <Feeds key={post?.id} userImg={post?.author?.profileImgUrl} 
                        content={post?.content || "No content available"} 
                        user={post?.author?.username || "Unknown User"}
                        />
                     ))}
                </div>
    )
}