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
     <div className="flex h-screen">
        <ConversationList
         conversations={data?.getConversations ?? []}
         isLoading={isLoading}
         error={error as Error | null}
         selectedConversationId={selectedConversationId}
         setSelectedConversationId={setSelectedConversationId}
        />
        <ChatWindow conversationId={selectedConversationId}
         conversations={data?.getConversations ?? []}  
         />
     </div>
    </div>
  );
}