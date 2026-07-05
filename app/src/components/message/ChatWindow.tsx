
type Props = {
  conversationId: string | null;
};

export default function ChatWindow({conversationId} : Props) {
   if (!conversationId) {
    return (
      <div className="flex-1 flex items-center justify-center">
        Select a conversation
      </div>
    );
  }
   return (
    <div className="flex-1">
      Conversation: {conversationId}
    </div>
  );
}