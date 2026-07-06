"use client";

import { useGetConversationsQuery } from "@/lib/generated";
import { Loader } from "../loader";
import { useGetCurrentUserQuery } from "@/lib/generated";

type Props = {
   selectedConversationId: string | null;
   setSelectedConversationId: React.Dispatch<React.SetStateAction<string | null>>;
}


export default function ConversationList({selectedConversationId,setSelectedConversationId} : Props) {

   const { data, isLoading, error } = useGetConversationsQuery();
   const { data : currentUser } = useGetCurrentUserQuery();

   const curUserId = currentUser?.currUser?.id;

   if (isLoading) {
    return <Loader />;
   }

   if (error) {
    return <div className="w-80 p-4">Error fetching conversations.</div>;
   }
  return (
    <div className="w-80 border-r border-gray-300">
      {data?.getConversations.map((conv)=> {
        const otherParticipant = conv.participants.find(
          (participant) => participant.id !== curUserId
        );
      return (
       <div key={conv.id}
        onClick={()=>{setSelectedConversationId(conv.id)}}
        className={`p-4 cursor-pointer border-b ${
        selectedConversationId === conv.id ? "bg-blue-500" : "hover:bg-blue-300"
        }`}
       >
        <p>{otherParticipant?.username}</p>
       </div>
      );
      }
     )}
    </div>
  );
}