import { messageQueries } from "./queries"

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
     }
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

        return message;
     }
    },
    Query : messageQueries
}