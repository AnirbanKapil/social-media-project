"use client"

import { useGetMessagesQuery } from "@/lib/generated";
import { useGetCurrentUserQuery } from "@/lib/generated";
import { Loader } from "../loader";


type Props = {
  conversationId: string | null;
};

export default function ChatWindow({conversationId} : Props) {
  
  const {data : currentUserData} = useGetCurrentUserQuery();
  const {data , isLoading} = useGetMessagesQuery(
    {
      conversationId : conversationId!
    },
    {
      enabled : !!conversationId,
    }
  )
  
  const currentUser = currentUserData?.currUser
  
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
      {data?.getMessages.map((message)=> {
        const isMine = message.sender.id === currentUser?.id
        return (
        <div key={message.id} className={`flex mb-4 ${isMine ? "justify-end" : "justify-end"}`}>
          <div className={`max-w-sm rounded-xl px-4 py-2 ${isMine ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}>
          <p>{message.content}</p>
          </div>
        </div>
        )
       })}
    </div>
  );
}