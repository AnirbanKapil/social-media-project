"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { CommentSection } from "@/app/src/components/comment/commentSection";
import { Feeds } from "@/app/src/components/feeds";
import { Loader } from "@/app/src/components/loader";
import { useGetPostByIdQuery } from "@/lib/generated";

export default function PostDetailPage() {
  const { postId } = useParams<{ postId: string }>();
  const commentsRef = useRef<HTMLElement>(null);
  const { data, isLoading, error } = useGetPostByIdQuery({ postId });
  const post = data?.getPostById;

  useEffect(() => {
    if (!isLoading && window.location.hash === "#comments") {
      commentsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [isLoading, post]);

  if (isLoading) return <Loader />;

  if (error) {
    return <p className="p-4 text-red-500">Unable to load post: {error.message}</p>;
  }

  if (!post) {
    return (
      <div className="p-4">
        <p>Post not found.</p>
        <Link href="/dashboard" className="mt-3 inline-block text-blue-400 hover:underline">
          Back to feed
        </Link>
      </div>
    );
  }

  return (
    <div className="mb-10">
      <div className="p-3">
        <Link href="/dashboard" className="text-blue-400 hover:underline">
          Back to feed
        </Link>
      </div>
      <Feeds
        id={post.id}
        content={post.content}
        userImg={post.author?.profileImgUrl}
        user={post.author?.username ?? "Unknown User"}
        firstName={post.author?.firstName ?? undefined}
        lastName={post.author?.lastName ?? undefined}
        imgSrcs={post.imgURLs}
        created={post.createdAt}
        likesCount={post.likesCount}
        isLiked={post.isLiked}
        commentsCount={post.commentsCount}
        isDetailPage
      />
      <section
        id="comments"
        ref={commentsRef}
        className="scroll-mt-4 border-b border-gray-600 p-4"
      >
        <h2 className="mb-4 text-xl font-semibold">Comments</h2>
        <CommentSection postId={post.id} />
      </section>
    </div>
  );
}
