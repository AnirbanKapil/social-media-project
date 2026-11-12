
import prisma from "@/lib/prisma";
import { getCommentsArgsSchema, parseInput } from "@/lib/validation";

type CommentQueryContext = {
    prisma?: typeof prisma;
    session?: { user?: { id?: string | null } | null } | null;
};

export const commentQueries = {
    getComments : async (_parent: unknown, args: {postId : string}, ctx: CommentQueryContext) => {
        if (!ctx?.session?.user) {
          throw new Error("Not authenticated");
        };

        const { postId } = parseInput(getCommentsArgsSchema, args);
        const commentPrisma = ctx.prisma ?? prisma;

        const post = await commentPrisma.post.findFirst({
            where: { id: postId, isHidden: false },
            select: { id: true },
        });
        if (!post) {
            return [];
        }
        
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