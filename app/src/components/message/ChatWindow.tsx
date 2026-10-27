"use client"

import { useGetMessagesQuery } from "@/lib/generated";
import { useGetCurrentUserQuery } from "@/lib/generated";
import { Loader } from "../loader";
import MessageInput from "./MessageInput";
import ChatHeader from "./ChatHeader";
import { GetConversationsQuery } from "@/lib/generated"
import Link from "next/link";
import { IoMdArrowRoundBack } from "react-icons/io";
import { ArrowLeft, MessageCircle } from "lucide-react";

type Props = {
  conversationId: string | null;
  conversations: GetConversationsQuery["getConversations"];
  onBack?: () => void;
};

export default function ChatWindow({conversationId,conversations,onBack} : Props) {
  
  const {data : currentUserData} = useGetCurrentUserQuery();
  const {data , isLoading} = useGetMessagesQuery(
    {
      conversationId : conversationId || ""
    },
    {
      enabled : !!conversationId,
      refetchInterval: 5000,
    }
  )
  
  const currentUser = currentUserData?.currUser
   
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
  
  const otherParticipant = activeConversation?.participants.find((p)=> p.id !== currentUser?.id)

  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-[#0d111b]">
      <div className="flex shrink-0 items-center border-b border-white/10 lg:hidden">
        <button
          type="button"
          onClick={() => onBack?.()}
          aria-label="Back to conversations"
          className="flex items-center gap-2 px-4 py-3 text-sm text-slate-400 transition-colors hover:text-white"
        >
          <IoMdArrowRoundBack size={19} />
          Inbox
        </button>
      </div>
      {otherParticipant && <ChatHeader username={otherParticipant.username} />}

      <div className="thin-scrollbar min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-8">
        {data?.getMessages.length ? (
          data.getMessages.map((message) => {
            const isMine = message.sender.id === currentUser?.id;
            return (
              <div key={message.id} className={`mb-4 flex ${isMine ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 sm:max-w-[70%] ${
                    isMine
                      ? "rounded-br-md bg-indigo-500 text-white"
                      : "rounded-bl-md border border-white/[0.07] bg-white/[0.055] text-slate-100"
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words text-sm leading-6">{message.content}</p>
                  <p className={`mt-1.5 text-right text-[11px] ${isMine ? "text-indigo-100/70" : "text-slate-500"}`}>
                    {new Date(Number(message.createdAt)).toLocaleTimeString([], {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
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
    </div>
  );
}