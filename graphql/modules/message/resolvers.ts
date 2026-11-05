import type { PrismaClient } from "@/app/generated/prisma/client";
import { getUnreadCountForConversation, messageQueries } from "./queries"
import { publishRealtimeEvent } from "@/lib/realtime-events";
import {
  conversationIdArgsSchema,
  createConversationSchema,
  parseInput,
  sendMessageSchema,
} from "@/lib/validation";

type ResolverContext = {
  session?: { user?: { id?: string | null } | null } | null;
  prisma: PrismaClient;
};

export const messageResolvers = {
    
    
    Conversation: {
     unreadCount: async (
       parent: { id: string; unreadCount?: number },
       _args: unknown,
       ctx: ResolverContext,
     ) => {
       if (typeof parent.unreadCount === "number") {
         return parent.unreadCount;
       }

       const userId = ctx.session?.user?.id;
       if (!userId) {
         return 0;
       }

       return getUnreadCountForConversation(ctx.prisma, userId, parent.id);
     },

     participants: async (parent: any, _args : any, ctx : any) => {
      const participants = await ctx.prisma.conversationParticipant.findMany({
      where: {
        conversationId: parent.id,
       },
        include: {
        user: true,
        },
       });

       return participants.map((p) => p.user);
     },

     messages : async (parent: any, _args : any, ctx : any) => {
        const { prisma } = ctx;

        return await prisma.message.findMany({
            where : {
                conversationId : parent.id
            },
            orderBy : {
                createdAt: "asc",
            }
        })
     },

     lastMessage : async (parent: any, _args : any, ctx : any) => {
        const { prisma } = ctx;

        return await prisma.message.findFirst({
            where : {
                conversationId : parent.id
            },
            orderBy : {
                createdAt : "desc"
            }
        })
     },
    },


    Message: {
     sender: async (parent : any, arg : any, ctx : any) => {
        const { prisma } = ctx;
        return await prisma.user.findUnique({
        where: {
             id: parent.senderId,
        },
      });
     },
    },
    
    Mutation: {

     createConversation : async (parent : any, args: { userId: string }, ctx : any) => {
           if (!ctx?.session?.user) {
             throw new Error("Not authenticated");
           }   
           const { userId } = parseInput(createConversationSchema, args);
           const currentUserId = ctx?.session?.user?.id;
            
           if (currentUserId === userId) {
           throw new Error("You cannot create a conversation with yourself.");
           }

           const { prisma } = ctx;
           const otherUser= await prisma.user.findUnique({
            where : {
                id : userId
            }
           });
           if(!otherUser){
            throw new Error("User not found.");
           }

           const existingConversation = await prisma.conversation.findFirst({
            where : {
                AND : [
                    {
                        participants : {
                            some : {
                                userId : currentUserId
                            }
                        }
                    },
                    {
                        participants : {
                            some : {
                                userId,
                            }
                        }
                    }
                ]
            }
           });
            if (existingConversation) {
              return existingConversation;
            }

            const conversation = await prisma.conversation.create({
               data: {
                  participants : {
                          create: [
                                   {
                                   userId: currentUserId,
                                  },
                                  {
                                   userId,
                                   },
                                  ],
                    },
               },
            });

            return conversation;
     },

     markConversationRead : async (
       _parent: unknown,
       args: { conversationId: string },
       ctx: ResolverContext,
     ) => {
        const userId = ctx.session?.user?.id;
        if (!userId) {
             throw new Error("Not authenticated");
           };

        const { conversationId } = parseInput(conversationIdArgsSchema, args);
        const { prisma } = ctx;

        const participant = await prisma.conversationParticipant.findUnique({
            where : {
                conversationId_userId : {
                     conversationId,
                     userId
                }
            }
        });
        if (!participant) {
          throw new Error("You are not a participant in this conversation.");
        }

        await prisma.conversationParticipant.update({
            where : {
                conversationId_userId : {
                     conversationId,
                     userId
                }
            },
            data : {
                lastReadAt : new Date()
            }
        });

        return true;
     },

     sendMessage : async (parent : any, args: {conversationId : string, content: string }, ctx : any) => {
        if (!ctx?.session?.user) {
             throw new Error("Not authenticated");
           };   
        const currentUserId = ctx?.session?.user?.id;

        const { conversationId, content } = parseInput(sendMessageSchema, args);
        const { prisma } = ctx;

        const participant = await prisma.conversationParticipant.findUnique({
            where : {
                conversationId_userId : {
                     conversationId,
                     userId : currentUserId
                }
            }
        });
        if (!participant) {
          throw new Error("You are not a participant in this conversation.");
        };

        const message = await prisma.message.create({
            data : {
                content,
                conversationId,
                senderId : currentUserId
            }
        });

        try {
            const participants = await prisma.conversationParticipant.findMany({
                where : {
                    conversationId,
                },
                select : {
                    userId: true,
                },
            });

            const sender = await prisma.user.findUnique({
                where : {
                    id : currentUserId,
                },
                select : {
                    username: true,
                    firstName: true,
                    lastName: true,
                },
            });

            const senderName =
                [sender?.firstName, sender?.lastName].filter(Boolean).join(" ") ||
                sender?.username;
            const preview =
                content.length > 140 ? `${content.slice(0, 140)}...` : content;

            await Promise.all(
                participants
                    .filter(({ userId }) => userId !== currentUserId)
                    .map(({ userId }) =>
                        publishRealtimeEvent({
                            type: "message.created",
                            recipientId: userId,
                            recordId: message.id,
                            conversationId,
                            senderUsername: sender?.username,
                            senderName,
                            preview,
                        }),
                    ),
            );
        } catch (error) {
            console.error(
                `Message "${message.id}" was saved, but realtime delivery could not be prepared:`,
                error,
            );
        }

        return message;
     }
    },
    Query : messageQueries
}