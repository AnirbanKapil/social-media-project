import { messageQueries } from "./queries"
import { publishRealtimeEvent } from "@/lib/realtime-events";

export const messageResolvers = {
    
    
    Conversation: {
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

     createConversation : async (parent : any, { userId }: { userId: string }, ctx : any) => {
           if (!ctx?.session?.user) {
             throw new Error("Not authenticated");
           }   
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

     sendMessage : async (parent : any, { conversationId,content }: {conversationId : string, content: string }, ctx : any) => {
        if (!ctx?.session?.user) {
             throw new Error("Not authenticated");
           };   
        const currentUserId = ctx?.session?.user?.id;

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

            await Promise.all(
                participants
                    .filter(({ userId }) => userId !== currentUserId)
                    .map(({ userId }) =>
                        publishRealtimeEvent({
                            type: "message.created",
                            recipientId: userId,
                            recordId: message.id,
                            conversationId,
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