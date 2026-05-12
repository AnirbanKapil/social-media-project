
export const postQueries = {
    getAllPosts : async ( _parent : any, _args : any, context : any) => {
          try {
             const { prisma } = context; 
            const posts = await prisma.post.findMany({orderBy : {createdAt : "desc"}})
            
            return posts || [];
          } catch (error) {
            console.error("Failed to fetch posts:", error);
            throw new Error("Internal Server Error");
          }
    }
}