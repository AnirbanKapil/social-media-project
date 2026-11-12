"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "./toast-provider";

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
  const { showToast } = useToast();

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
        queryClient.invalidateQueries({ queryKey: ["UnseenNotificationCount"] }),
        queryClient.invalidateQueries({ queryKey: ["UnreadMessageCount"] }),
      ]);
    };

    const handleConnectionRecovery = () => {
      invalidateDatabaseQueries();
    };

    const handleWindowFocus = () => {
      handleConnectionRecovery();
    };

    const handleVisibilityRecovery = () => {
      if (document.visibilityState === "visible") {
        handleConnectionRecovery();
      }
    };

    const handleOnlineRecovery = () => {
      invalidateDatabaseQueries();
      if (eventSource?.readyState === EventSource.CLOSED) {
        eventSource.close();
        void connect();
      }
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
          let messagePayload: {
            conversationId?: string;
            senderUsername?: string;
            senderName?: string;
            preview?: string;
          };
          try {
            messagePayload = JSON.parse(event.data) as {
              conversationId?: string;
              senderUsername?: string;
              senderName?: string;
              preview?: string;
            };
          } catch {
            console.error("Received an invalid message.created event");
            return;
          }

          if (!messagePayload.conversationId) {
            console.error("Message event is missing conversationId");
            return;
          }

          const conversationId = messagePayload.conversationId;

          void Promise.all([
            queryClient.invalidateQueries({
              queryKey: ["GetMessages", { conversationId }],
            }),
            queryClient.invalidateQueries({ queryKey: ["GetConversations"] }),
            queryClient.invalidateQueries({ queryKey: ["UnreadMessageCount"] }),
          ]);

          const activeConversationId =
            typeof window === "undefined"
              ? null
              : new URLSearchParams(window.location.search).get("conversationId");

          if (activeConversationId === conversationId) {
            return;
          }

          const senderName =
            messagePayload.senderName?.trim() ||
            messagePayload.senderUsername?.trim() ||
            "Someone";

          showToast({
            title: `${senderName} sent you a message`,
            description: messagePayload.preview,
            href: `/messages?conversationId=${encodeURIComponent(conversationId)}`,
          });
        });

        eventSource.addEventListener("conversation.updated", () => {
          void Promise.all([
            queryClient.invalidateQueries({ queryKey: ["GetConversations"] }),
            queryClient.invalidateQueries({ queryKey: ["GetMessages"] }),
          ]);
        });

        eventSource.addEventListener("conversation.member_added", (event) => {
          let memberPayload: {
            conversationId?: string;
            conversationName?: string;
            actorName?: string;
          };
          try {
            memberPayload = JSON.parse(event.data) as {
              conversationId?: string;
              conversationName?: string;
              actorName?: string;
            };
          } catch {
            console.error("Received an invalid conversation.member_added event");
            return;
          }

          if (!memberPayload.conversationId) {
            console.error(
              "conversation.member_added event is missing conversationId",
            );
            return;
          }

          const conversationId = memberPayload.conversationId;

          void Promise.all([
            queryClient.invalidateQueries({ queryKey: ["GetConversations"] }),
            queryClient.invalidateQueries({ queryKey: ["GetMessages"] }),
          ]);

          const actorName = memberPayload.actorName?.trim() || "Someone";
          const conversationName =
            memberPayload.conversationName?.trim() || "a group";

          showToast({
            title: `${actorName} added you to ${conversationName}`,
            description: "Open the group to start chatting.",
            href: `/messages?conversationId=${encodeURIComponent(conversationId)}`,
          });
        });

        eventSource.addEventListener("notification.created", () => {
          void Promise.all([
            queryClient.invalidateQueries({ queryKey: ["GetNotifications"] }),
            queryClient.invalidateQueries({
              queryKey: ["UnreadNotificationCount"],
            }),
            queryClient.invalidateQueries({
              queryKey: ["UnseenNotificationCount"],
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
    window.addEventListener("focus", handleWindowFocus);
    window.addEventListener("online", handleOnlineRecovery);
    document.addEventListener("visibilitychange", handleVisibilityRecovery);

    return () => {
      cancelled = true;
      window.removeEventListener("focus", handleWindowFocus);
      window.removeEventListener("online", handleOnlineRecovery);
      document.removeEventListener("visibilitychange", handleVisibilityRecovery);
      eventSource?.close();
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }
      if (tokenRefreshTimer) {
        clearTimeout(tokenRefreshTimer);
      }
      invalidateDatabaseQueries();
    };
  }, [queryClient, showToast, status]);

  return children;
}
