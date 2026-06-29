
export const postQueries = {
    getAllPosts : async ( _parent : any, _args : any, ctx : any) => {
          try {
             const { prisma } = ctx; 
            const posts = await prisma.post.findMany({
              include: {
                       author: true,
            },
              orderBy: {
                       createdAt: "desc",
            },
            })
            
            return posts || [];
          } catch (error) {
            console.error("Failed to fetch posts:", error);
            throw new Error("Internal Server Error");
          }
    }
}