"use client";

import Image from "next/image";
import Link from "next/link";
import { useGetCurrentUserQuery } from "@/lib/generated";

export function UserStatsCard() {
  const { data, isLoading, error } = useGetCurrentUserQuery({});
  const user = data?.currUser;

  if (isLoading) return <p className="text-sm text-gray-500">Loading profile...</p>;

  if (error) {
    const err = error as Error;
    return (
      <p role="alert" className="text-sm text-red-500">
        Error: {err.message}
      </p>
    );
  }

  if (!user) return <p className="text-sm text-gray-600">No data</p>;

  const stats = [
    { label: "Posts", value: user.posts?.length ?? 0 },
    { label: "Followers", value: user.followersCount },
    { label: "Following", value: user.followingCount },
  ];

  return (
    <div className="text-slate-700">
      <Link
        href={`/dashboard/${user.username}`}
        className="flex items-center gap-3"
      >
        {user.profileImgUrl ? (
          <Image
            src={user.profileImgUrl}
            alt={user.username}
            width={56}
            height={56}
            className="h-14 w-14 rounded-full"
          />
        ) : (
          <div className="h-14 w-14 rounded-full bg-blue-300" />
        )}
        <div className="min-w-0">
          <p className="truncate font-bold">{user.username}</p>
          <p className="truncate text-xs text-gray-500">{user.email}</p>
        </div>
      </Link>

      <div className="mt-3 flex justify-between">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-lg font-bold text-slate-800">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
