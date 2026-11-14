"use client";

import Image from "next/image";
import Link from "next/link";
import { CldImage } from "next-cloudinary";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteThreadPartMutation } from "@/lib/generated";
import type { GetPostByIdQuery } from "@/lib/generated";
import { getFullName } from "@/lib/displayName";

type ThreadPart = NonNullable<GetPostByIdQuery["getPostById"]>["thread"][number];

type Props = {
  part: ThreadPart;
  isCurrent?: boolean;
  canDelete?: boolean;
  onDeleted?: () => void;
};

export function ThreadPartCard({ part, isCurrent = false, canDelete = false, onDeleted }: Props) {
  const deleteThreadPart = useDeleteThreadPartMutation();
  const queryClient = useQueryClient();

  const author = part.author;
  const authorName = getFullName(author) || author?.username || "Unknown User";
  const images = part.imgURLs ?? [];

  const handleDelete = async () => {
    if (!window.confirm("Delete this part of the thread? This cannot be undone.")) {
      return;
    }

    try {
      await deleteThreadPart.mutateAsync({ postId: part.id });
      await queryClient.invalidateQueries({ queryKey: ["GetPostById"] });
      await queryClient.invalidateQueries({ queryKey: ["GetAllPosts"] });
      onDeleted?.();
    } catch (error) {
      console.error("Failed to delete thread part:", error);
    }
  };

  return (
    <div
      className={`grid grid-cols-12 border-b border-gray-600 ${
        isCurrent ? "bg-gray-900/60 ring-1 ring-inset ring-blue-500/60" : ""
      }`}
    >
      <div className="col-span-1">
        {author?.profileImgUrl ? (
          <Image
            alt="DP image"
            src={author.profileImgUrl}
            height={50}
            width={50}
            className="m-2 h-12 w-12 rounded-full"
          />
        ) : (
          <div className="m-2 h-12 w-12 rounded-full bg-blue-300" />
        )}
      </div>
      <div className="col-span-11 m-2.5">
        <div className="flex items-start justify-between gap-3">
          <Link
            href={`/dashboard/${author?.username ?? ""}`}
            className="font-semibold hover:underline"
          >
            <p className="leading-tight">{authorName}</p>
            {author?.username && authorName !== author.username && (
              <p className="text-xs text-slate-500">@{author.username}</p>
            )}
          </Link>
          <div className="flex items-center gap-3">
            {isCurrent && (
              <span className="text-xs font-medium text-blue-400">You are here</span>
            )}
            <p className="text-xs text-slate-400">
              {new Date(Number(part.createdAt)).toLocaleString()}
            </p>
            {canDelete && (
              <button
                type="button"
                onClick={() => void handleDelete()}
                disabled={deleteThreadPart.isPending}
                className="text-xs text-red-500 hover:underline disabled:opacity-50"
              >
                {deleteThreadPart.isPending ? "Deleting..." : "Delete"}
              </button>
            )}
          </div>
        </div>

        {part.content && (
          <p className="mt-2 whitespace-pre-wrap">{part.content}</p>
        )}

        {images.length > 0 && (
          <div className="mt-3 grid grid-cols-2 gap-2">
            {images.map((image, index) => (
              <CldImage
                key={`${image}-${index}`}
                className="h-auto max-h-96 w-full rounded-md object-contain"
                alt={`Thread part image ${index + 1} of ${images.length}`}
                src={image}
                width={1080}
                height={1080}
                crop="limit"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
