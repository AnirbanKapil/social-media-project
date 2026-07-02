"use client";

import { useGetConversationsQuery } from "@/lib/generated";
import { Loader } from "../loader";

export default function ConversationList() {

   const { data, isLoading, error } = useGetConversationsQuery();
   
   if (isLoading) {
    return <Loader />;
   }

   if (error) {
    return <div className="w-80 p-4">Error fetching conversations.</div>;
   }
  return (
    <div className="w-80 border-r border-gray-300">
      {data?.getConversations.map((conv)=> (
        <div key={conv.id} className="border-b p-4">
           {conv.participants.map((partn)=> (
              <p key={partn.id}>{partn.username}</p>
           ))}
        </div>
      ))}
    </div>
  );
}