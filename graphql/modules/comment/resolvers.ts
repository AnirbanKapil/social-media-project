import { commentQueries } from "./queries";
import prisma from "@/lib/prisma";

type CommentResolverContext = {
    prisma?: typeof prisma;
    session?: { user?: { id?: string | null } | null } | null;
};

export const commentResolvers = {
    
    Comment: {

        postOwnerId: (parent: { post: { authorId: string } }) => parent.post.authorId,
       
        author: async (parent: { authorId: string }, _args: unknown, ctx: CommentResolverContext) => {

        const commentPrisma = ctx.prisma ?? prisma;

        return await commentPrisma.user.findUnique({
            where : {
                id : parent.authorId
            }
        });
        },
        
        post: async (parent: { postId: string }, _args: unknown, ctx: CommentResolverContext) => {
        
        const commentPrisma = ctx.prisma ?? prisma;
        
        return await commentPrisma.post.findUnique({
            where : {
                id : parent.postId
            }
        });
        },
    },

    Mutation: {

        createComment : async (_parent: unknown, {postId, content}: {postId : string, content : string}, ctx: CommentResolverContext) => {
            const userId = ctx.session?.user?.id;
            if (!userId) {
             throw new Error("Not authenticated");
            };
             
            const commentPrisma = ctx.prisma ?? prisma;

            return await commentPrisma.comment.create({
                data : {
                    postId,
                    content,
                    authorId : userId
                    
                }
             })
        },

        deleteComment : async (_parent: unknown, {commentId}: {commentId : string}, ctx: CommentResolverContext) => {
           const userId = ctx.session?.user?.id;
           if (!userId) {
             throw new Error("Not authenticated");
            };
            
            const commentPrisma = ctx.prisma ?? prisma;

            const comment = await commentPrisma.comment.findUnique({
                where: {
                  id: commentId,
                 },
                include: {
                    post: {
                        select: { authorId: true },
                    },
                },
            });
            
            if(!comment){
                throw new Error("Comment not found");
            };
            
            if(comment.authorId !== userId && comment.post.authorId !== userId){
                throw new Error("Unauthorized");
            };

            await commentPrisma.comment.delete({
                where : {
                    id : commentId
                }
            });

            return true;
        }
    },

    Query : commentQueries
};