"use client";

import { useMemo, useState } from "react";
import { Loader } from "../loader";
import { useGetCurrentUserQuery } from "@/lib/generated";
import { GetConversationsQuery } from "@/lib/generated";
import { MessageCircle, Search } from "lucide-react";

type Props = {
  conversations: GetConversationsQuery["getConversations"];
  isLoading: boolean;
  error: Error | null;
  selectedConversationId: string | null;
  setSelectedConversationId: React.Dispatch<React.SetStateAction<string | null>>;
};

export default function ConversationList({
  selectedConversationId,
  setSelectedConversationId,
  conversations,
  isLoading,
  error,
}: Props) {
  const [search, setSearch] = useState("");
  const { data: currentUser } = useGetCurrentUserQuery();
  const curUserId = currentUser?.currUser?.id;

  const filteredConversations = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return conversations;

    return conversations.filter((conversation) => {
      const otherParticipant = conversation.participants.find(
        (participant) => participant.id !== curUserId,
      );
      return (
        otherParticipant?.username.toLowerCase().includes(term) ||
        conversation.lastMessage?.content.toLowerCase().includes(term)
      );
    });
  }, [conversations, curUserId, search]);

  return (
    <aside className="flex h-full min-h-0 w-full flex-col border-r border-white/10">
      <div className="border-b border-white/10 px-5 pb-4 pt-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-white">Inbox</h2>
            <p className="mt-1 text-xs text-slate-500">Keep in touch</p>
          </div>
          <div className="flex h-8 min-w-8 items-center justify-center rounded-full bg-white/[0.06] px-2 text-xs font-medium text-slate-300">
            {conversations.length}
          </div>
        </div>
        <label className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-[#080b12] px-3 py-2.5 text-slate-400 transition-colors focus-within:border-indigo-400/50">
          <Search size={16} className="shrink-0" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search conversations"
            className="min-w-0 flex-1 bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
            aria-label="Search conversations"
          />
        </label>
      </div>

      <div className="thin-scrollbar min-h-0 flex-1 overflow-y-auto p-2">
        {isLoading ? (
          <div className="flex h-full items-center justify-center"><Loader /></div>
        ) : error ? (
          <div className="p-4 text-sm text-rose-300">Could not load your conversations. Please try again.</div>
        ) : filteredConversations.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.05] text-slate-500">
              <MessageCircle size={21} />
            </div>
            <p className="text-sm font-medium text-slate-300">
              {search ? "No conversations found" : "Your inbox is quiet"}
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              {search ? "Try another name or message." : "Start a conversation and it will show up here."}
            </p>
          </div>
        ) : (
          filteredConversations.map((conv) => {
            const otherParticipant = conv.participants.find(
              (participant) => participant.id !== curUserId,
            );
            const username = otherParticipant?.username ?? "Conversation";
            const initials = username.slice(0, 2).toUpperCase();
            const isSelected = selectedConversationId === conv.id;

            return (
              <button
                type="button"
                key={conv.id}
                onClick={() => setSelectedConversationId(conv.id)}
                aria-current={isSelected ? "true" : undefined}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors ${
                  isSelected
                    ? "bg-indigo-500/15 ring-1 ring-inset ring-indigo-400/20"
                    : "hover:bg-white/[0.045]"
                }`}
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400/30 to-violet-500/20 text-sm font-semibold text-indigo-100 ring-1 ring-inset ring-white/10">
                  {initials}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-slate-100">{username}</span>
                  <span className="mt-1 block truncate text-xs text-slate-400">
                    {conv.lastMessage?.content ?? "Start a conversation"}
                  </span>
                </span>
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
}