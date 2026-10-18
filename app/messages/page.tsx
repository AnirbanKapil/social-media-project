"use client"


import ChatWindow from "../src/components/message/ChatWindow";
import ConversationList from "../src/components/message/ConversationList";
import { useState } from "react";
import { useGetConversationsQuery } from "@/lib/generated";
import { useSearchParams } from "next/navigation";

export default function MessagesPage() {
  const searchParams = useSearchParams();
  const initialConversationId = searchParams.get("conversationId");

  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(initialConversationId);
  const { data, isLoading, error} = useGetConversationsQuery();



  return (
    <div>
     <div className="flex h-screen overflow-hidden">
        <div
          className={`${selectedConversationId ? "hidden lg:block" : "block"} h-full w-full lg:w-64 lg:shrink-0`}
        >
          <ConversationList
           conversations={data?.getConversations ?? []}
           isLoading={isLoading}
           error={error as Error | null}
           selectedConversationId={selectedConversationId}
           setSelectedConversationId={setSelectedConversationId}
          />
        </div>
        <div
          className={`${selectedConversationId ? "flex" : "hidden lg:flex"} h-full min-w-0 flex-1`}
        >
          <ChatWindow conversationId={selectedConversationId}
           conversations={data?.getConversations ?? []}
           onBack={() => setSelectedConversationId(null)}
           />
        </div>
     </div>
    </div>
  );
}