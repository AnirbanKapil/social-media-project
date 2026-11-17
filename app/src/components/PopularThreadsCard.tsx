"use client";

import Link from "next/link";
import { Heart, TrendingUp } from "lucide-react";
import { useGetPopularThreadsQuery } from "@/lib/generated";
import { getPreviewText } from "@/lib/textPreview";

const PREVIEW_LIMIT = 3;

export function PopularThreadsCard() {
  const { data, isLoading, error } = useGetPopularThreadsQuery(
    { first: PREVIEW_LIMIT },
    { staleTime: 1000 * 60 * 5 },
  );

  const threads = data?.getPopularThreads.posts ?? [];

  return (
    <div>
      <h3 className="mb-2 flex items-center gap-2 text-lg font-bold text-slate-700">
        <TrendingUp size={18} />
        Popular threads
      </h3>

      {isLoading && (
        <p className="text-sm text-gray-500">Loading popular threads...</p>
      )}

      {!!error && (
        <p role="alert" className="text-sm text-red-500">
          Could not load popular threads.
        </p>
      )}

      {!isLoading && !error && threads.length === 0 && (
        <p className="text-sm text-gray-600">No popular threads yet.</p>
      )}

      <ul className="space-y-2">
        {threads.map((thread, index) => (
          <li key={thread.id}>
            <Link
              href={`/dashboard/post/${thread.id}`}
              className="flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-gray-300"
            >
              <span className="w-4 shrink-0 text-sm font-bold text-gray-500">
                {index + 1}
              </span>
              <div className="min-w-0">
                <p className="line-clamp-2 text-sm font-semibold text-slate-700">
                  {getPreviewText(thread.content, 60)}
                </p>
                <p className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Heart size={12} />
                    {thread.likesCount}
                  </span>
                  <span>
                    Thread · {thread.threadPartCount}{" "}
                    {thread.threadPartCount === 1 ? "part" : "parts"}
                  </span>
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <Link
        href="/dashboard/popular"
        className="mt-2 inline-block text-sm font-semibold text-blue-600 hover:underline"
      >
        Explore popular threads →
      </Link>
    </div>
  );
}
