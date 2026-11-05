"use client";

import { useState } from "react";
import { useSendMessageMutation } from "@/lib/generated";
import { useQueryClient } from "@tanstack/react-query";
import { Send } from "lucide-react";
import { z } from "zod";
import { messageContentSchema } from "@/lib/validation";
import { useZodForm } from "@/lib/validation/useZodForm";
import { FieldError } from "@/app/src/components/form/FieldError";

const messageFormSchema = z.object({ content: messageContentSchema });

type Props = {
     conversationId: string;
}

export default function MessageInput ({conversationId} : Props) {
    const [content, setContent] = useState("");

    const sendMessageMutation = useSendMessageMutation();
    const { errorFor, onBlur, clearError, submit, reset } =
        useZodForm(messageFormSchema);

    const queryClient = useQueryClient();

    const handleSend = async () => {
        const data = submit({ content });
        if (!data) return;

        try {
          await sendMessageMutation.mutateAsync({
            conversationId,
            content: data.content
          });
          setContent(""); 
          reset();
          
          queryClient.invalidateQueries({
          queryKey: ["GetMessages"]
          });
          queryClient.invalidateQueries({
          queryKey: ["GetConversations"]
          });
        } catch (error) {
            console.log(error)
        }
    };

    return (
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void handleSend();
        }}
        className="flex flex-col gap-1"
      >
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#080b12] p-2 pl-4 shadow-lg shadow-black/10 focus-within:border-indigo-400/40">
        <input
          className="min-w-0 flex-1 bg-transparent py-2 text-sm text-slate-100 outline-none placeholder:text-slate-500"
          value={content}
          onChange={(event) => {
            setContent(event.target.value);
            clearError("content");
          }}
          onBlur={() => onBlur("content", { content })}
          aria-invalid={!!errorFor("content")}
          aria-describedby={errorFor("content") ? "message-content-error" : undefined}
          placeholder="Write a message..."
          aria-label="Write a message"
        />
        <button
          type="submit"
          disabled={sendMessageMutation.isPending}
          aria-label="Send message"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500 text-white transition-colors hover:bg-indigo-400 disabled:cursor-not-allowed disabled:bg-white/[0.07] disabled:text-slate-500"
        >
          <Send size={17} />
        </button>
        </div>
        <FieldError
          id="message-content-error"
          message={errorFor("content")}
          className="px-3 text-sm text-red-400"
        />
      </form>
    );
};