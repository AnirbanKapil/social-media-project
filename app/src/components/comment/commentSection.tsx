import {
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useGetCommentsQuery,
  useGetCurrentUserQuery,
} from "@/lib/generated";
import { Loader } from "../loader";
import { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { commentContentSchema } from "@/lib/validation";
import { useZodForm } from "@/lib/validation/useZodForm";
import { FieldError } from "@/app/src/components/form/FieldError";
import { CommentItem, type CommentData } from "./CommentItem";

const commentFormSchema = z.object({ content: commentContentSchema });

type Props = {
  postId: string;
};

export function CommentSection ({postId} : Props) {
    const { data, isLoading } =useGetCommentsQuery({postId,});
    const [content, setContent] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [replyingTo, setReplyingTo] = useState<CommentData | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const createCommentMutation = useCreateCommentMutation();
    const deleteCommentMutation = useDeleteCommentMutation();
    const { data: currentUserData } = useGetCurrentUserQuery({});
    const { errorFor, onBlur, clearError, submit, reset } =
      useZodForm(commentFormSchema);

    const queryClient = useQueryClient();

    if (isLoading) return <Loader />;

    const comments = data?.getComments ?? [];
    const topLevelComments = comments.filter((comment) => !comment.parentId);
    const repliesByParent = new Map<string, CommentData[]>();

    for (const comment of comments) {
      if (!comment.parentId) continue;

      const replies = repliesByParent.get(comment.parentId) ?? [];
      replies.push(comment);
      repliesByParent.set(comment.parentId, replies);
    }

    const handleComment = async () => {
      const data = submit({ content });
      if (!data) return;

      try {
        await createCommentMutation.mutateAsync({
          postId,
          content: data.content,
          parentCommentId: replyingTo?.id ?? null,
        });
        setContent("");
        setReplyingTo(null);
        reset();
        await queryClient.invalidateQueries({queryKey: ["GetComments"],});
        await queryClient.invalidateQueries({queryKey: ["GetAllPosts"],});
        await queryClient.invalidateQueries({queryKey: ["GetPostById", { postId }],});
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to add comment");
      }
    }

    const handleReply = (comment: CommentData) => {
      setReplyingTo(comment);
      setError(null);
      inputRef.current?.focus();
    }

    const handleDeleteComment = async (commentId: string) => {
      try {
        await deleteCommentMutation.mutateAsync({ commentId });
        if (replyingTo?.id === commentId) {
          setReplyingTo(null);
        }
        await queryClient.invalidateQueries({queryKey: ["GetComments", { postId }]});
        await queryClient.invalidateQueries({queryKey: ["GetAllPosts"]});
        await queryClient.invalidateQueries({queryKey: ["GetPostById", { postId }]});
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to delete comment");
      }
    }

    return(
      <div className="flex h-full flex-col mt-1.5">
        {topLevelComments.map((comment) => {
          const replies = repliesByParent.get(comment.id) ?? [];

          return (
            <div key={comment.id}>
              <div className="mb-4">
                <CommentItem
                  comment={comment}
                  currentUserId={currentUserData?.currUser?.id}
                  isDeleting={deleteCommentMutation.isPending}
                  onReply={handleReply}
                  onDelete={handleDeleteComment}
                />
              </div>

              {replies.length > 0 && (
                <div className="mb-6 ml-8 space-y-4 border-l border-gray-700 pl-4 sm:ml-12">
                  {replies.map((reply) => (
                    <CommentItem
                      key={reply.id}
                      comment={reply}
                      currentUserId={currentUserData?.currUser?.id}
                      isDeleting={deleteCommentMutation.isPending}
                      isReply
                      onReply={handleReply}
                      onDelete={handleDeleteComment}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
        {error && <p role="alert" className="mb-2 text-sm text-red-400">{error}</p>}
        {replyingTo && (
          <div className="mb-2 flex items-center justify-between rounded-lg border border-gray-700 bg-gray-900/60 px-3 py-2 text-xs text-gray-300">
            <span>
              Replying to{" "}
              <span className="font-medium text-indigo-300">@{replyingTo.author.username}</span>
            </span>
            <button
              type="button"
              onClick={() => setReplyingTo(null)}
              className="text-slate-400 transition-colors hover:text-white"
            >
              Cancel
            </button>
          </div>
        )}
        <div className="flex gap-3">
        <input value={content}
         ref={inputRef}
         placeholder={replyingTo ? `Reply to @${replyingTo.author.username}` : "Add a comment"}
         className={`flex-1 rounded-full border bg-transparent px-4 py-2 outline-none ml-1 ${
           errorFor("content") ? "border-red-500" : "border-gray-600"
         }`}
         onChange={(e) => {
           setContent(e.target.value);
           clearError("content");
         }}
         onBlur={() => onBlur("content", { content })}
         aria-invalid={!!errorFor("content")}
         aria-describedby={errorFor("content") ? "comment-content-error" : undefined}
         onKeyDown={(e) => {
           if (e.key === "Enter") {
             e.preventDefault();
             void handleComment();
           }
         }}/>
         <button className="rounded-full mr-1 bg-blue-500 px-5 py-2 text-white disabled:opacity-50"
          disabled={createCommentMutation.isPending}
          onClick={handleComment}>Comment</button>
        </div>
        <FieldError id="comment-content-error" message={errorFor("content")} />
      </div>
    )
};
