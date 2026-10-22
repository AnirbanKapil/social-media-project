"use client";

import Image from "next/image";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import {
  useMarkNotificationReadMutation,
  type GetNotificationsQuery,
} from "@/lib/generated";
import { formatRelativeTime } from "./formatTime";

type NotificationData = GetNotificationsQuery["getNotifications"]["notifications"][number];

const actionText: Record<string, string> = {
  FOLLOW: "followed you",
  LIKE: "liked your post",
  COMMENT: "commented on your post",
  REPOST: "reposted your post",
};

export function NotificationItem({ notification }: { notification: NotificationData }) {
  const queryClient = useQueryClient();
  const markRead = useMarkNotificationReadMutation();

  const { actor, post, comment, readAt } = notification;
  const displayName = actor.firstName ?? actor.username;

  const postId = post?.id;
  const href = notification.type === "FOLLOW" || !postId
    ? `/dashboard/${actor.username}`
    : notification.type === "COMMENT"
      ? `/dashboard/post/${postId}#comments`
      : `/dashboard/post/${postId}`;

  const snippet =
    notification.type === "COMMENT"
      ? comment?.content
      : notification.type === "LIKE" || notification.type === "REPOST"
        ? post?.content
        : null;

  const handleClick = () => {
    if (readAt) return;

    markRead.mutate(
      { notificationId: notification.id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["GetNotifications"] });
          queryClient.invalidateQueries({ queryKey: ["UnreadNotificationCount"] });
        },
      },
    );
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={`flex gap-3 border-b border-gray-700 px-4 py-3 transition-colors hover:bg-slate-900 ${
        readAt ? "" : "bg-indigo-950/40"
      }`}
    >
      {actor.profileImgUrl ? (
        <Image
          src={actor.profileImgUrl}
          alt={actor.username}
          width={44}
          height={44}
          className="h-11 w-11 shrink-0 rounded-full object-cover"
        />
      ) : (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-500/30 text-sm font-bold text-indigo-200">
          {actor.username.charAt(0).toUpperCase()}
        </div>
      )}

      <div className="min-w-0 flex-1">
        <p className="text-sm text-slate-200">
          <span className="font-semibold text-white">{displayName}</span>{" "}
          {actionText[notification.type]}
        </p>
        {snippet && (
          <p className="mt-0.5 line-clamp-2 text-sm text-slate-400">{snippet}</p>
        )}
        <p className="mt-1 text-xs text-slate-500">
          {formatRelativeTime(notification.createdAt)}
        </p>
      </div>

      {!readAt && (
        <span
          aria-label="Unread notification"
          className="mt-2 h-2 w-2 shrink-0 rounded-full bg-indigo-400"
        />
      )}
    </Link>
  );
}
