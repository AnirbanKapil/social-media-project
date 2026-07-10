"use client"

import { useGetMessagesQuery } from "@/lib/generated";
import { useGetCurrentUserQuery } from "@/lib/generated";
import { Loader } from "../loader";
import MessageInput from "./MessageInput";
import ChatHeader from "./ChatHeader";
import { GetConversationsQuery } from "@/lib/generated"
import Link from "next/link";
import { IoMdArrowRoundBack } from "react-icons/io";

type Props = {
  conversationId: string | null;
  conversations: GetConversationsQuery["getConversations"];
};

export default function ChatWindow({conversationId,conversations} : Props) {
  
  const {data : currentUserData} = useGetCurrentUserQuery();
  const {data , isLoading} = useGetMessagesQuery(
    {
      conversationId : conversationId || ""
    },
    {
      enabled : !!conversationId,
      refetchInterval: 5000,
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
  
  if (!conversations) {
    return <div className="flex-1 p-4"><Loader /></div>; 
  }

  if (isLoading) {
    return <div className="flex-1 p-4"><Loader /></div>;
  }

  const activeConversation = conversations?.find((c)=> c.id === conversationId)
  
  const otherParticipant = activeConversation?.participants.find((p)=> p.id !== currentUser?.id)

   return (
    <div className="flex flex-col h-screen max-h-screen w-full pb-7 px-7 ">
     <Link href="/dashboard"
              className="cursor-pointer p-2">
              <IoMdArrowRoundBack size={24} />
     </Link> 
     {otherParticipant && (
      <div key={otherParticipant.id}>
        <ChatHeader username={otherParticipant.username}/>
      </div>
     )}
      
      <div className="flex-1 overflow-y-auto px-4 mt-10">
        {data?.getMessages.map((message)=> {
        const isMine = message.sender.id === currentUser?.id
        return (
         <div key={message.id} className={`flex mb-4 ${isMine ? "justify-end" : "justify-start"}`}>
          <div className={`max-w-sm rounded-xl px-4 py-2 ${isMine ? "bg-blue-600 text-white" : "bg-gray-200 text-black"}`}>
          <p>{message.content}</p>
          <p className="text-slate-400 text-xs my-1.5 flex justify-end">{new Date(Number(message.createdAt)).toLocaleString()}</p>
          </div>
         </div>
        )
        })}
      </div>

      <div className="flex-shrink-0 px-4 mt-4">
       <MessageInput conversationId={conversationId} />
      </div>
    </div>
  );
}