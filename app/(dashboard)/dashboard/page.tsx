"use client"

import { Publish } from "@/app/src/components/publish";
import { Feeds } from "@/app/src/components/feeds";
import { useGetAllPostsQuery } from "@/lib/generated";
import { Loader } from "@/app/src/components/loader";
import { CommentModal } from "@/app/src/components/comment/commentModal";
import { useState } from "react";

export default function FeedsPage () {
    
    const [selectedPostId, setSelectedPostId] = useState<string | undefined | null>(null); 

    const { data, isLoading, error } = useGetAllPostsQuery({},
      {
      staleTime: 1000 * 60, 
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    }
    );
    if (isLoading) return <Loader />;

    
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
                        <Feeds key={post?.id} 
                        id={post?.id || ""}
                        userImg={post?.author?.profileImgUrl} 
                        content={post?.content || "No content available"} 
                        user={post?.author?.username || "Unknown User"}
                        imgSrc={post?.imgURL}
                        created={post?.createdAt || "unknown"}
                        likesCount={post?.likesCount}
                        isLiked={post?.isLiked}
                        commentsCount={post?.commentsCount}
                        onCommentClick={() => setSelectedPostId(post?.id)}
                        />
                     ))}
                     {selectedPostId && (
                      <CommentModal 
                       postId={selectedPostId}
                       onClose={() => setSelectedPostId(null)}
                      />
                     )}
                </div>
    )
}