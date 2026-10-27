"use client"

import ChatWindow from "../src/components/message/ChatWindow";
import ConversationList from "../src/components/message/ConversationList";
import { useState } from "react";
import { useGetConversationsQuery } from "@/lib/generated";
import { useSearchParams } from "next/navigation";
import { MessageCircle, ShieldCheck } from "lucide-react";

export default function MessagesPage() {
  const searchParams = useSearchParams();
  const initialConversationId = searchParams.get("conversationId");
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(initialConversationId);
  const { data, isLoading, error } = useGetConversationsQuery();

  return (
    <main className="flex h-dvh flex-col overflow-hidden bg-[#080b12] px-4 py-5 text-slate-100 sm:px-7 sm:py-7 lg:px-10">
      <header className="mx-auto mb-5 flex w-full max-w-7xl shrink-0 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-300 ring-1 ring-inset ring-indigo-400/20">
            <MessageCircle size={21} />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">Messages</h1>
            <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">Your conversations, all in one place</p>
          </div>
        </div>
        <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-slate-400 sm:flex">
          <ShieldCheck size={15} className="text-emerald-400" />
          Direct messages
        </div>
      </header>

      <section className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 overflow-hidden rounded-none border-y border-white/10 bg-[#0d111b] shadow-2xl shadow-black/20 sm:rounded-2xl sm:border">
        <div className={`${selectedConversationId ? "hidden lg:flex" : "flex"} h-full w-full shrink-0 flex-col lg:w-[340px]`}>
          <ConversationList
            conversations={data?.getConversations ?? []}
            isLoading={isLoading}
            error={error as Error | null}
            selectedConversationId={selectedConversationId}
            setSelectedConversationId={setSelectedConversationId}
          />
        </div>
        <div className={`${selectedConversationId ? "flex" : "hidden lg:flex"} h-full min-w-0 flex-1`}>
          <ChatWindow
            conversationId={selectedConversationId}
            conversations={data?.getConversations ?? []}
            onBack={() => setSelectedConversationId(null)}
          />
        </div>
      </section>
    </main>
  );
}