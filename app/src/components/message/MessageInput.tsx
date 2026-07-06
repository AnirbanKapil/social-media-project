"use client";

import { useState } from "react";
import { useSendMessageMutation } from "@/lib/generated";


type Props = {
     conversationId: string;
}

export default function MessageInput ({conversationId} : Props) {
    const [content, setContent] = useState("");

    const sendMessageMutation = useSendMessageMutation();

    const handleSend = async () => {
        if (!content.trim()) return;

        try {
          await sendMessageMutation.mutateAsync({
            conversationId,
            content
          });
          setContent("")             
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <div className="flex gap-2 p-4 border-t">
           <input 
            className="flex-1 border rounded-lg px-3 py-2 outline-none"
            value={content}
            onChange={(e)=> setContent(e.target.value)}
            placeholder="Type a message..."
           />
           <button
            onClick={handleSend}
            className="px-4 py-2 rounded-lg bg-blue-500 text-white">
            Send
           </button>
        </div>
    )

};