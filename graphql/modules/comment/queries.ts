

export const commentQueries = {
    getComments : async (_parent : any, {postId}: {postId : string}, ctx : any) => {
        if (!ctx?.session?.user) {
          throw new Error("Not authenticated");
        };

        const { prisma } = ctx; 
        
        return prisma.comment.findMany({
            where: {
                postId
            },
            orderBy: {
                 createdAt: "asc",
            }
        });
    }
};