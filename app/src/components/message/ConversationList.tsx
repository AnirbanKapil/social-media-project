"use client";

import { useGetConversationsQuery } from "@/lib/generated";
import { Loader } from "../loader";
import { useGetCurrentUserQuery } from "@/lib/generated";

export default function ConversationList() {

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
       <div key={conv.id}>
        <p>{otherParticipant?.username}</p>
       </div>
      );
      }
     )}
    </div>
  );
}