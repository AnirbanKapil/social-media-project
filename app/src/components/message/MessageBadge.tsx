"use client";

import { useUnreadMessageCountQuery } from "@/lib/generated";

export function MessageBadge() {
  const { data } = useUnreadMessageCountQuery(undefined, {
    refetchOnWindowFocus: true,
  });

  const count = data?.unreadMessageCount ?? 0;

  if (!count) {
    return null;
  }

  return (
    <span className="absolute -right-2 -top-2 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white">
      {count > 99 ? "99+" : count}
    </span>
  );
}
