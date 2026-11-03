"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";

type RealtimeTokenResponse = {
  token: string;
  expiresIn: number;
};

export function RealtimeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (status !== "authenticated") {
      return;
    }

    const realtimeUrl = process.env.NEXT_PUBLIC_REALTIME_URL;
    if (!realtimeUrl) {
      console.error("NEXT_PUBLIC_REALTIME_URL is not configured");
      return;
    }

    let eventSource: EventSource | null = null;
    let cancelled = false;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let tokenRefreshTimer: ReturnType<typeof setTimeout> | null = null;

    const invalidateDatabaseQueries = () => {
      void Promise.all([
        queryClient.invalidateQueries({ queryKey: ["GetMessages"] }),
        queryClient.invalidateQueries({ queryKey: ["GetConversations"] }),
        queryClient.invalidateQueries({ queryKey: ["GetNotifications"] }),
        queryClient.invalidateQueries({ queryKey: ["UnreadNotificationCount"] }),
      ]);
    };

    const connect = async () => {
      try {
        const response = await fetch("/api/realtime/token", {
          method: "POST",
          cache: "no-store",
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Realtime authentication failed (${response.status})`);
        }

        const payload = (await response.json()) as RealtimeTokenResponse;
        if (cancelled) return;

        if (tokenRefreshTimer) {
          clearTimeout(tokenRefreshTimer);
        }
        tokenRefreshTimer = setTimeout(() => {
          eventSource?.close();
          void connect();
        }, Math.max(10_000, (payload.expiresIn - 30) * 1000));

        const url = new URL("/events", realtimeUrl);
        url.searchParams.set("token", payload.token);
        eventSource = new EventSource(url.toString());

        eventSource.onopen = invalidateDatabaseQueries;

        eventSource.addEventListener("message.created", (event) => {
          let messagePayload: { conversationId?: string };
          try {
            messagePayload = JSON.parse(event.data) as {
              conversationId?: string;
            };
          } catch {
            console.error("Received an invalid message.created event");
            return;
          }

          if (!messagePayload.conversationId) {
            console.error("Message event is missing conversationId");
            return;
          }

          void queryClient.invalidateQueries({
            queryKey: ["GetMessages", {
              conversationId: messagePayload.conversationId,
            }],
          });
          void queryClient.invalidateQueries({
            queryKey: ["GetConversations"],
          });
        });

        eventSource.addEventListener("notification.created", () => {
          void Promise.all([
            queryClient.invalidateQueries({ queryKey: ["GetNotifications"] }),
            queryClient.invalidateQueries({
              queryKey: ["UnreadNotificationCount"],
            }),
          ]);
        });

        eventSource.onerror = () => {
          if (cancelled) return;
          invalidateDatabaseQueries();
        };
      } catch (error) {
        console.error("Failed to connect realtime SSE:", error);
        if (!cancelled) {
          reconnectTimer = setTimeout(() => {
            void connect();
          }, 5000);
        }
      }
    };

    void connect();

    return () => {
      cancelled = true;
      eventSource?.close();
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }
      if (tokenRefreshTimer) {
        clearTimeout(tokenRefreshTimer);
      }
      invalidateDatabaseQueries();
    };
  }, [queryClient, status]);

  return children;
}
