
export const messageQueries = {
    getConversations : async ( _parent : any, _args : any, ctx : any) => {
        if (!ctx?.session?.user) {
          throw new Error("Not authenticated");
        }

        const { prisma } = ctx; 
        try {
            return await prisma.conversation.findMany({
                where: {
                participants: {
                some: {
                userId: ctx?.session?.user.id,
            },
          },
         },
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