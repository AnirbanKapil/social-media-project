"use client"

import { Publish } from "@/app/src/components/publish";
import { Feeds } from "@/app/src/components/feeds";
import { useGetAllPostsQuery } from "@/lib/generated";

export default function FeedsPage () {

    const { data, isLoading, error } = useGetAllPostsQuery({});
    if (isLoading) return <p>Loading...</p>;

    
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