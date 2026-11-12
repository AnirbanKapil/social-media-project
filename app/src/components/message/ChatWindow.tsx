"use client"

import { Fragment, useEffect, useState } from "react";
import { toDate } from "../notifications/formatTime";
import { useGetMessagesQuery } from "@/lib/generated";
import { useGetCurrentUserQuery } from "@/lib/generated";
import { useMarkConversationReadMutation } from "@/lib/generated";
import { useQueryClient } from "@tanstack/react-query";
import { Loader } from "../loader";
import MessageInput from "./MessageInput";
import ChatHeader from "./ChatHeader";
import GroupSettingsModal from "./GroupSettingsModal";
import { getMemberDisplayName } from "./conversationUtils";
import { GetConversationsQuery } from "@/lib/generated"
import Link from "next/link";
import { ArrowLeft, MessageCircle } from "lucide-react";

type Props = {
  conversationId: string | null;
  conversations: GetConversationsQuery["getConversations"];
  onBack?: () => void;
};

const dayNumber = (date: Date) =>
  Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000;

function formatDayLabel(date: Date) {
  const diff = dayNumber(new Date()) - dayNumber(date);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: date.getFullYear() === new Date().getFullYear() ? undefined : "numeric",
  });
}

export default function ChatWindow({conversationId,conversations,onBack} : Props) {
  
  const {data : currentUserData} = useGetCurrentUserQuery();
  const {data , isLoading} = useGetMessagesQuery(
    {
      conversationId : conversationId || ""
    },
    {
      enabled : !!conversationId,
    }
  )
  
  const currentUser = currentUserData?.currUser
  const queryClient = useQueryClient();
  const { mutate: markConversationRead } = useMarkConversationReadMutation();
  const [showSettings, setShowSettings] = useState(false);

  const lastMessageId = data?.getMessages.at(-1)?.id;

  useEffect(() => {
    if (!conversationId) return;

    markConversationRead(
      { conversationId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["UnreadMessageCount"] });
          queryClient.invalidateQueries({ queryKey: ["GetConversations"] });
        },
      },
    );
  }, [conversationId, lastMessageId, markConversationRead, queryClient]);
   
  if (!conversationId) {
    return (
      <div className="relative flex h-full w-full flex-col items-center justify-center px-6 text-center">
        <Link
          href="/dashboard"
          className="absolute left-5 top-5 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-400 transition-colors hover:bg-white/[0.05] hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to dashboard
        </Link>
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-indigo-500/15 text-indigo-300 ring-1 ring-inset ring-indigo-400/20">
          <MessageCircle size={28} />
        </div>
        <h2 className="text-lg font-semibold text-white">Your messages</h2>
        <p className="mt-2 max-w-xs text-sm leading-6 text-slate-400">
          Choose a conversation from your inbox to pick up where you left off.
        </p>
      </div>
    );
  }
  
  if (!conversations) {
    return <div className="flex-1 p-4"><Loader /></div>; 
  }

  if (isLoading) {
    return <div className="flex h-full w-full items-center justify-center"><Loader /></div>;
  }

  const activeConversation = conversations?.find((c)=> c.id === conversationId)

  if (!activeConversation) {
    if (conversations.length === 0) {
      return <div className="flex h-full w-full items-center justify-center"><Loader /></div>;
    }

    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3 px-6 text-center">
        <p className="text-sm text-slate-400">
          This conversation is no longer available.
        </p>
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300 transition-colors hover:bg-white/[0.06]"
          >
            Back to messages
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-[#0d111b]">
      <ChatHeader
        conversation={activeConversation}
        currentUserId={currentUser?.id}
        onBack={onBack}
        onOpenSettings={() => setShowSettings(true)}
      />

      <div className="thin-scrollbar min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-8">
        {data?.getMessages.length ? (
          data.getMessages.map((message, index) => {
            const isMine = message.sender.id === currentUser?.id;
            const messageDate = toDate(message.createdAt);
            const previousMessage =
              index > 0 ? data.getMessages[index - 1] : null;
            const showDayDivider =
              !previousMessage ||
              dayNumber(toDate(previousMessage.createdAt)) !== dayNumber(messageDate);

            return (
              <Fragment key={message.id}>
                {showDayDivider && (
                  <div className="my-4 flex items-center gap-3 text-[11px] uppercase tracking-wide text-slate-500">
                    <span className="h-px flex-1 bg-white/10" />
                    <span>{formatDayLabel(messageDate)}</span>
                    <span className="h-px flex-1 bg-white/10" />
                  </div>
                )}
                <div className={`mb-4 flex ${isMine ? "justify-end" : "justify-start"}`}>
                  <div className="max-w-[85%] sm:max-w-[70%]">
                    {activeConversation.isGroup && !isMine && (
                      <p className="mb-1 px-1 text-[11px] font-medium text-slate-400">
                        {getMemberDisplayName(message.sender)}
                      </p>
                    )}
                    <div
                      className={`rounded-2xl px-4 py-3 ${
                        isMine
                          ? "rounded-br-md bg-indigo-500 text-white"
                          : "rounded-bl-md border border-white/[0.07] bg-white/[0.055] text-slate-100"
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words text-sm leading-6">{message.content}</p>
                      <p className={`mt-1.5 text-right text-[11px] ${isMine ? "text-indigo-100/70" : "text-slate-500"}`}>
                        {messageDate.toLocaleTimeString([], {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </Fragment>
            );
          })
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.05] text-slate-500">
              <MessageCircle size={21} />
            </div>
            <p className="text-sm font-medium text-slate-300">This is the beginning</p>
            <p className="mt-1 text-xs text-slate-500">Send a message to get the conversation started.</p>
          </div>
        )}
      </div>

      <div className="shrink-0 px-3 pb-4 sm:px-6 sm:pb-5">
        <MessageInput conversationId={conversationId} />
      </div>

      {showSettings && (
        <GroupSettingsModal
          conversation={activeConversation}
          currentUserId={currentUser?.id}
          onClose={() => setShowSettings(false)}
          onExited={() => {
            setShowSettings(false);
            onBack?.();
          }}
        />
      )}
    </div>
  );
}