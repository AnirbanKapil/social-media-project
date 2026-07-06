"use client"

import { useGetMessagesQuery } from "@/lib/generated";
import { Loader } from "../loader";


type Props = {
  conversationId: string | null;
};

export default function ChatWindow({conversationId} : Props) {
   
  const {data , isLoading} = useGetMessagesQuery(
    {
      conversationId : conversationId!
    },
    {
      enabled : !!conversationId,
    }
  )
  if (!conversationId) {
    return (
      <div className="flex-1 flex items-center justify-center">
        Select a conversation
      </div>
    );
  }

  if (isLoading) {
    return <div className="flex-1 p-4"><Loader /></div>;
  }


   return (
    <div className="flex-1 overflow-y-auto">
      {data?.getMessages.map((message)=> (
        <div key={message.id} className="border-b p-3">
          <p className="font-semibold">
            {message.sender.username}
          </p>
          <p>{message.content}</p>
        </div>
      ))}
    </div>
  );
}