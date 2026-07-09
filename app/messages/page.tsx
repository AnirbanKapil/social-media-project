"use client"


import ChatWindow from "../src/components/message/ChatWindow";
import ConversationList from "../src/components/message/ConversationList";
import { useState } from "react";
import { useGetConversationsQuery } from "@/lib/generated";

export default function MessagesPage() {
  
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
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