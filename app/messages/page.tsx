import ChatWindow from "../src/components/message/ChatWindow";
import ConversationList from "../src/components/message/ConversationList";

export default function MessagesPage() {
  return (
    <div className="flex h-screen">
         <ConversationList />
         <ChatWindow />
    </div>
  );
}