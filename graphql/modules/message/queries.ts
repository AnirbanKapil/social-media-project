
export const messageQueries = {
    

    getConversation : async ( _parent : any, _args : any, ctx : any) => {
        if (!ctx?.session?.user) {
          throw new Error("Not authenticated");
        }
          const { prisma } = ctx; 
        try {
            return prisma.conversation.findMany({
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
    }
}