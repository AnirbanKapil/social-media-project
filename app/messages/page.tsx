import ChatWindow from "../src/components/message/ChatWindow";
import ConversationList from "../src/components/message/ConversationList";
import { useState } from "react";

export default function MessagesPage() {

  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  
  return (
    <div className="flex h-screen">
        <ConversationList
        selectedConversationId={selectedConversationId}
        setSelectedConversationId={setSelectedConversationId}
        />
         <ChatWindow conversationId={selectedConversationId}/>
    </div>
  );
}