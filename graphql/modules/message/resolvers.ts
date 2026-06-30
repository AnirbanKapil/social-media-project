import { messageQueries } from "./queries"

export const messageResolvers = {
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

           const otherUser= await prisma.user.find({
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
                  participants: {
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
     }
    },
    Query : messageQueries
}