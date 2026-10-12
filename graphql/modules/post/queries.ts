
import prisma from "@/lib/prisma";

export const postQueries = {
    getPostById: async (_parent: unknown, { postId }: { postId: string }) => {
      return prisma.post.findUnique({
        where: { id: postId },
        include: { author: true },
      });
    },

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