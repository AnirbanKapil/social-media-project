"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetSuggestedUsersQuery,
  useFollowUserMutation,
} from "@/lib/generated";

export function WhoToFollow() {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useGetSuggestedUsersQuery({ limit: 5 });
  const { mutateAsync: followUser, isPending } = useFollowUserMutation();
  const [removed, setRemoved] = useState<Set<string>>(new Set());

  const handleFollow = async (id: string) => {
    try {
      await followUser({ to: id });
      setRemoved((prev) => new Set(prev).add(id));
      queryClient.invalidateQueries({ queryKey: ["GetSuggestedUsers"] });
      queryClient.invalidateQueries({ queryKey: ["GetCurrentUser"] });
    } catch (err) {
      console.error("Failed to follow user:", err);
    }
  };

  const users = (data?.suggestedUsers ?? []).filter(
    (user) => !removed.has(user.id),
  );

  return (
    <div className="mt-4">
      <h3 className="mb-2 text-lg font-bold text-slate-700">Who to follow</h3>

      {isLoading && <p className="text-sm text-gray-500">Loading suggestions...</p>}

      {!!error && (
        <p role="alert" className="text-sm text-red-500">
          Could not load suggestions.
        </p>
      )}

      {!isLoading && !error && users.length === 0 && (
        <p className="text-sm text-gray-600">
          You&apos;re one of the first — invite a friend!
        </p>
      )}

      <ul className="space-y-2">
        {users.map((user) => (
          <li
            key={user.id}
            className="flex items-center justify-between gap-2 rounded-lg p-2 hover:bg-gray-300 transition-colors"
          >
            <Link
              href={`/dashboard/${user.username}`}
              className="flex items-center gap-3 min-w-0"
            >
              {user.profileImgUrl ? (
                <Image
                  src={user.profileImgUrl}
                  alt={user.username}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-blue-300" />
              )}
              <div className="min-w-0">
                <p className="truncate font-semibold text-slate-700">
                  {user.username}
                </p>
                {(user.firstName || user.lastName) && (
                  <p className="truncate text-xs text-gray-500">
                    {[user.firstName, user.lastName].filter(Boolean).join(" ")}
                  </p>
                )}
              </div>
            </Link>
            <button
              type="button"
              disabled={isPending}
              onClick={() => handleFollow(user.id)}
              className="shrink-0 rounded-full bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
            >
              Follow
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
