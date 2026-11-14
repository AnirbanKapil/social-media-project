import Image from "next/image";
import type { GetCommentsQuery } from "@/lib/generated";

export type CommentData = GetCommentsQuery["getComments"][number];

type Props = {
  comment: CommentData;
  currentUserId: string | null | undefined;
  isDeleting: boolean;
  isReply?: boolean;
  onReply: (comment: CommentData) => void;
  onDelete: (commentId: string) => void;
};

export function CommentItem({
  comment,
  currentUserId,
  isDeleting,
  isReply = false,
  onReply,
  onDelete,
}: Props) {
  const canDelete =
    comment.author.id === currentUserId ||
    comment.postOwnerId === currentUserId;

  return (
    <div className="flex gap-3">
      {comment.author.profileImgUrl ? (
        <Image
          alt={`${comment.author.username}'s profile picture`}
          src={comment.author.profileImgUrl}
          height={50}
          width={50}
          className="m-2 h-10 w-10 shrink-0 rounded-full object-cover sm:h-12 sm:w-12"
        />
      ) : (
        <div className="mx-2 my-2 h-10 w-10 shrink-0 rounded-full bg-gray-600 sm:h-12 sm:w-12" />
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-semibold">{comment.author.username}</p>
          {canDelete && (
            <button
              type="button"
              onClick={() => onDelete(comment.id)}
              disabled={isDeleting}
              className="ml-auto text-sm text-red-400 hover:text-red-300 disabled:opacity-50"
              aria-label={`Delete comment by ${comment.author.username}`}
            >
              Delete
            </button>
          )}
        </div>

        <p className="whitespace-pre-wrap break-words">{comment.content}</p>

        {!isReply && (
          <button
            type="button"
            onClick={() => onReply(comment)}
            className="mt-1 text-xs font-medium text-slate-400 transition-colors hover:text-indigo-300"
          >
            Reply
          </button>
        )}
      </div>
    </div>
  );
}
