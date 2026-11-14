import { commentQueries } from "./queries";
import prisma from "@/lib/prisma";
import { createNotification } from "../notification/helpers";
import {
  createCommentSchema,
  deleteCommentArgsSchema,
  parseInput,
} from "@/lib/validation";
import { buildVisiblePostWhere } from "../post/visibility";

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

        createComment : async (_parent: unknown, args: {postId : string, content : string, parentCommentId? : string | null}, ctx: CommentResolverContext) => {
            const userId = ctx.session?.user?.id;
            if (!userId) {
             throw new Error("Not authenticated");
            };

            const { postId, content, parentCommentId } = parseInput(createCommentSchema, args);
             
            const commentPrisma = ctx.prisma ?? prisma;

            const post = await commentPrisma.post.findFirst({
                where: {
                    id: postId,
                    ...buildVisiblePostWhere(userId),
                },
                select: { id: true, authorId: true, isHidden: true, threadRootId: true },
            });

            if (!post) {
                throw new Error("Post not found");
            }

            if (post.threadRootId) {
                throw new Error("Engage with the thread root.");
            }

            let parent: { id: string; authorId: string; parentId: string | null } | null = null;

            if (parentCommentId) {
                parent = await commentPrisma.comment.findFirst({
                    where: {
                        id: parentCommentId,
                        postId,
                    },
                    select: {
                        id: true,
                        authorId: true,
                        parentId: true,
                    },
                });

                if (!parent) {
                    throw new Error("Parent comment not found");
                }

                if (parent.parentId) {
                    throw new Error("Replies can only be one level deep");
                }
            }

            const comment = await commentPrisma.comment.create({
                data : {
                    postId,
                    content,
                    authorId : userId,
                    parentId: parent?.id ?? null,
                }
             });

            if (parent) {
                await createNotification({
                    type: "REPLY",
                    recipientId: parent.authorId,
                    actorId: userId,
                    postId: post.id,
                    commentId: comment.id,
                });
            } else {
                await createNotification({
                    type: "COMMENT",
                    recipientId: post.authorId,
                    actorId: userId,
                    postId: post.id,
                    commentId: comment.id,
                });
            }

            return comment;
        },

        deleteComment : async (_parent: unknown, args: {commentId : string}, ctx: CommentResolverContext) => {
           const userId = ctx.session?.user?.id;
           if (!userId) {
             throw new Error("Not authenticated");
            };

            const { commentId } = parseInput(deleteCommentArgsSchema, args);
            
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