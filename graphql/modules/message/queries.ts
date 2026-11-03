
import type { Prisma } from "@/app/generated/prisma/client";

export const messageQueries = {
    getConversations : async ( _parent : any, _args : any, ctx : any) => {
        if (!ctx?.session?.user) {
          throw new Error("Not authenticated");
        }

        const { prisma } = ctx; 
        try {
            const conversations: Prisma.ConversationGetPayload<{
                include: { messages: true };
            }>[] = await prisma.conversation.findMany({
                where: {
                participants: {
                some: {
                userId: ctx?.session?.user.id,
            },
          },
         },
                include: {
                    messages: {
                        orderBy: {
                            createdAt: "desc",
                        },
                        take: 1,
                    },
                },
        });  

            return conversations.sort((a, b) => {
                const aTime = a.messages[0]?.createdAt ?? a.createdAt;
                const bTime = b.messages[0]?.createdAt ?? b.createdAt;
                return bTime.getTime() - aTime.getTime();
            });
        } catch (error) {
            console.log("Failed to fetch messages:", error)
            throw new Error("Internal Server Error");
        }
    },
    
    getMessages : async (_parent : any, { conversationId }: { conversationId: string }, ctx : any) => {
        if (!ctx?.session?.user) {
          throw new Error("Not authenticated");
        }

        const { prisma } =  ctx ;
          
        try {
            return await prisma.message.findMany({
            where : {
                conversationId
            },
            orderBy : {
                createdAt : "asc"
            }
          })
        } catch (error) {
            console.log("Failed to fetch messages:", error)
            throw new Error("Internal Server Error"); 
        }
    }
}