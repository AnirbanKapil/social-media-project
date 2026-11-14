"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CommentSection } from "@/app/src/components/comment/commentSection";
import { Feeds } from "@/app/src/components/feeds";
import { Loader } from "@/app/src/components/loader";
import AddThreadPartModal from "@/app/src/components/post/AddThreadPartModal";
import { ThreadPartCard } from "@/app/src/components/post/ThreadPartCard";
import {
  useGetCurrentUserQuery,
  useGetPostByIdQuery,
} from "@/lib/generated";
import { MAX_THREAD_PARTS } from "@/lib/validation";

export default function PostDetailPage() {
  const { postId } = useParams<{ postId: string }>();
  const router = useRouter();
  const commentsRef = useRef<HTMLElement>(null);
  const [showAddPart, setShowAddPart] = useState(false);
  const { data, isLoading, error } = useGetPostByIdQuery({ postId });
  const { data: currentUserData } = useGetCurrentUserQuery({});

  const post = data?.getPostById;
  const thread = post?.thread ?? [];
  const threadRoot = thread[0] ?? post;
  const isThread = thread.length > 1;
  const threadParts = thread.slice(1);
  const isThreadAuthor =
    !!threadRoot && currentUserData?.currUser?.id === threadRoot.author?.id;
  const isAuthor = !!post && currentUserData?.currUser?.id === post.author?.id;
  const appendRootId = isThread && threadRoot ? threadRoot.id : post?.id;
  const canStartThread = !!post && !isThread && isAuthor && !post.repostOf;
  const targetId = post?.repostOf?.id ?? post?.id;
  const commentsPostId = isThread && threadRoot ? threadRoot.id : targetId ?? post?.id;

  useEffect(() => {
    if (!isLoading && window.location.hash === "#comments") {
      commentsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [isLoading, post]);

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <p className="p-4 text-red-500">
        Unable to load post: {error instanceof Error ? error.message : "Unknown error"}
      </p>
    );
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

      {isThread && threadRoot ? (
        <div>
          {post.isThreadPart && (
            <div className="flex flex-wrap items-center justify-between gap-2 px-4 pb-1 text-sm text-slate-400">
              <span className="text-xs text-blue-400">
                Viewing part {post.threadPosition} of {threadParts.length}
              </span>
            </div>
          )}

          <Feeds
            id={threadRoot.id}
            content={threadRoot.content}
            visibility={threadRoot.visibility}
            userImg={threadRoot.author?.profileImgUrl}
            user={threadRoot.author?.username ?? "Unknown User"}
            firstName={threadRoot.author?.firstName ?? undefined}
            lastName={threadRoot.author?.lastName ?? undefined}
            imgSrcs={threadRoot.imgURLs}
            created={threadRoot.createdAt}
            likesCount={threadRoot.likesCount}
            isLiked={threadRoot.isLiked}
            isBookmarked={threadRoot.isBookmarked}
            isReposted={threadRoot.isReposted}
            repostsCount={threadRoot.repostsCount}
            commentsCount={threadRoot.commentsCount}
            threadPartCount={threadRoot.threadPartCount}
            isDetailPage
          />

          <div className="ml-6 border-l border-gray-700">
            {threadParts.map((part) => (
              <ThreadPartCard
                key={part.id}
                part={part}
                isCurrent={part.id === post.id}
                canDelete={isThreadAuthor}
                onDeleted={() => {
                  if (part.id === post.id) {
                    router.replace(`/dashboard/post/${threadRoot.id}`);
                  }
                }}
              />
            ))}
          </div>

          {isThreadAuthor && (
            <div className="p-4">
              {threadParts.length < MAX_THREAD_PARTS ? (
                <button
                  type="button"
                  onClick={() => setShowAddPart(true)}
                  className="rounded-lg border border-gray-700 px-4 py-2 text-sm hover:bg-gray-800"
                >
                  Add to thread
                </button>
              ) : (
                <p className="text-sm text-slate-500">
                  This thread has reached the maximum of {MAX_THREAD_PARTS} parts.
                </p>
              )}
            </div>
          )}

        </div>
      ) : (
        <>
        <Feeds
          id={post.id}
          content={post.content}
          visibility={post.visibility}
          userImg={post.author?.profileImgUrl}
          user={post.author?.username ?? "Unknown User"}
          firstName={post.author?.firstName ?? undefined}
          lastName={post.author?.lastName ?? undefined}
          imgSrcs={post.imgURLs}
          created={post.createdAt}
          likesCount={post.likesCount}
          isLiked={post.isLiked}
          isBookmarked={post.isBookmarked}
          isReposted={post.isReposted}
          repostsCount={post.repostsCount}
          repostOf={post.repostOf}
          commentsCount={post.commentsCount}
          threadPartCount={post.threadPartCount}
          isDetailPage
        />
        {canStartThread && (
          <div className="p-4">
            <button
              type="button"
              onClick={() => setShowAddPart(true)}
              className="rounded-lg border border-gray-700 px-4 py-2 text-sm hover:bg-gray-800"
            >
              Add to thread
            </button>
          </div>
        )}
        </>
      )}

      {showAddPart && appendRootId && (
        <AddThreadPartModal
          rootId={appendRootId}
          onClose={() => setShowAddPart(false)}
        />
      )}

      <section
        id="comments"
        ref={commentsRef}
        className="scroll-mt-4 border-b border-gray-600 p-4"
      >
        <h2 className="mb-4 text-xl font-semibold">Comments</h2>
        <CommentSection postId={commentsPostId ?? post.id} />
      </section>
    </div>
  );
}
