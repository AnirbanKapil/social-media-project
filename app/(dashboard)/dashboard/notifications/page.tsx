"use client";

import { useMemo, useState } from "react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { FaRegBell } from "react-icons/fa";
import { fetchGraphQL } from "@/lib/fetcher";
import {
  GetNotificationsDocument,
  useMarkAllNotificationsReadMutation,
  useUnreadNotificationCountQuery,
  type GetNotificationsQuery,
  type GetNotificationsQueryVariables,
} from "@/lib/generated";
import { Loader } from "@/app/src/components/loader";
import { NotificationItem } from "@/app/src/components/notifications/NotificationItem";
import { toDate } from "@/app/src/components/notifications/formatTime";

type NotificationData = GetNotificationsQuery["getNotifications"]["notifications"][number];

type NotificationGroup = {
  label: string;
  items: NotificationData[];
};

export default function NotificationsPage() {
  const [unreadOnly, setUnreadOnly] = useState(false);
  const queryClient = useQueryClient();
  const markAll = useMarkAllNotificationsReadMutation();

  const { data: unreadData } = useUnreadNotificationCountQuery(undefined, {
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
  });

  const {
    data,
    isLoading,
    error,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["GetNotifications", { unreadOnly }],
    queryFn: ({ pageParam }) =>
      fetchGraphQL<GetNotificationsQuery, GetNotificationsQueryVariables>(
        GetNotificationsDocument.toString(),
        { first: 20, after: pageParam, unreadOnly },
      ),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.getNotifications.nextCursor ?? undefined,
    staleTime: 1000 * 30,
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  const notifications = useMemo(
    () => data?.pages.flatMap((page) => page.getNotifications.notifications) ?? [],
    [data],
  );

  const groups = useMemo<NotificationGroup[]>(() => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const startOfLastWeek = new Date(startOfToday);
    startOfLastWeek.setDate(startOfToday.getDate() - 7);
    const weekAgo = startOfLastWeek.getTime();

    const today: NotificationData[] = [];
    const thisWeek: NotificationData[] = [];
    const earlier: NotificationData[] = [];

    for (const notification of notifications) {
      const createdAt = toDate(notification.createdAt).getTime();

      if (createdAt >= startOfToday.getTime()) {
        today.push(notification);
      } else if (createdAt >= weekAgo) {
        thisWeek.push(notification);
      } else {
        earlier.push(notification);
      }
    }

    return [
      { label: "Today", items: today },
      { label: "This week", items: thisWeek },
      { label: "Earlier", items: earlier },
    ].filter((group) => group.items.length > 0);
  }, [notifications]);

  const unreadCount = unreadData?.unreadNotificationCount ?? 0;

  const handleMarkAll = async () => {
    try {
      await markAll.mutateAsync({});
    } catch (err) {
      console.error("Failed to mark notifications as read:", err);
    } finally {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["GetNotifications"] }),
        queryClient.invalidateQueries({ queryKey: ["UnreadNotificationCount"] }),
      ]);
    }
  };

  if (isLoading) return <Loader />;

  if (error && !data) {
    const err = error as Error;
    return <p className="p-4 text-red-400">Error: {err.message}</p>;
  }

  return (
    <div className="mt-16 mb-10">
      <div className="flex items-center justify-between gap-3 border-b border-gray-600 px-4 py-3">
        <h1 className="text-xl font-semibold">Notifications</h1>
        <button
          type="button"
          onClick={() => void handleMarkAll()}
          disabled={markAll.isPending || unreadCount === 0}
          className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {markAll.isPending ? "Marking..." : "Mark all as read"}
        </button>
      </div>

      <div className="flex border-b border-gray-600">
        <button
          type="button"
          onClick={() => setUnreadOnly(false)}
          className={`flex-1 px-4 py-3 text-sm font-semibold transition-colors ${
            unreadOnly ? "text-slate-400 hover:bg-slate-900 hover:text-slate-200" : "border-b-2 border-indigo-400 text-white"
          }`}
        >
          All
        </button>
        <button
          type="button"
          onClick={() => setUnreadOnly(true)}
          className={`flex-1 px-4 py-3 text-sm font-semibold transition-colors ${
            unreadOnly ? "border-b-2 border-indigo-400 text-white" : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
          }`}
        >
          Unread{unreadCount > 0 ? ` (${unreadCount})` : ""}
        </button>
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center gap-3 px-4 py-16 text-center">
          <FaRegBell size={36} className="text-slate-500" />
          <p className="text-lg font-medium text-slate-200">You&apos;re all caught up</p>
          <p className="max-w-sm text-sm text-slate-400">
            {unreadOnly
              ? "You have no unread notifications."
              : "When someone follows you, or likes, comments on, or reposts your posts, you'll see it here."}
          </p>
        </div>
      ) : (
        groups.map((group) => (
          <section key={group.label}>
            <h2 className="border-b border-gray-700 bg-slate-950/80 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              {group.label}
            </h2>
            {group.items.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))}
          </section>
        ))
      )}

      {hasNextPage && (
        <div className="flex flex-col items-center gap-2 p-4">
          {isFetchNextPageError && (
            <p role="alert" className="text-sm text-red-400">
              Could not load more notifications. Please try again.
            </p>
          )}
          <button
            type="button"
            onClick={() => void fetchNextPage()}
            disabled={isFetchingNextPage}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
          >
            {isFetchingNextPage ? "Loading..." : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
}
