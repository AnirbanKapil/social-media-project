
import prisma from "@/lib/prisma";

type CommentQueryContext = {
    prisma?: typeof prisma;
    session?: { user?: { id?: string | null } | null } | null;
};

export const commentQueries = {
    getComments : async (_parent: unknown, {postId}: {postId : string}, ctx: CommentQueryContext) => {
        if (!ctx?.session?.user) {
          throw new Error("Not authenticated");
        };

        const commentPrisma = ctx.prisma ?? prisma;
        
        return commentPrisma.comment.findMany({
            where: {
                postId
            },
            include: {
                post: {
                    select: { authorId: true },
                },
            },
            orderBy: {
                 createdAt: "asc",
            }
        });
    }
};