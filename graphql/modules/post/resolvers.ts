import prisma from "@/lib/prisma";
import { postQueries } from "./queries";
import { createNotification, deleteNotification } from "../notification/helpers";
import {
  appendThreadPartSchema,
  createPostSchema,
  editPostSchema,
  MAX_THREAD_PARTS,
  parseInput,
  postIdArgsSchema,
  updatePostVisibilitySchema,
} from "@/lib/validation";
import { buildVisiblePostWhere } from "./visibility";



export const postResolvers= {

  Post: {
     imgURLs: (parent: { imgURLs?: string[] | null; imgURL?: string | null }) =>
       parent.imgURLs?.length ? parent.imgURLs : parent.imgURL ? [parent.imgURL] : [],

     likesCount: async(parent : any) => {
       return await prisma.like.count({
        where: {
          postId: parent.id
        }
       })
     },
     
     isLiked: async(parent : any, arg : any, ctx : any) => { 
        if(!ctx.session?.user){
            return
        };  
        const like = await prisma.like.findUnique({
          where: {
            userId_postId: {
              userId : ctx.session?.user?.id,
              postId : parent.id
            }
          }
        });
        return !!like;
      },

     isBookmarked: async(parent : any, arg : any, ctx : any) => {
        if(!ctx.session?.user){
            return
        };
        const bookmark = await prisma.bookmark.findUnique({
          where: {
            userId_postId: {
              userId : ctx.session?.user?.id,
              postId : parent.id
            }
          }
        });
        return !!bookmark;
     },

     repostsCount: async(parent : any) => {
        return await prisma.post.count({
          where: { repostOfId: parent.id, isHidden: false }
        });
     },

     isReposted: async(parent : any, arg : any, ctx : any) => {
        if(!ctx.session?.user){
            return
        };
        const repost = await prisma.post.findFirst({
          where: {
            authorId : ctx.session?.user?.id,
            repostOfId : parent.id,
          }
        });
        return !!repost;
     },

     repostOf: async(parent : any, _args : any, ctx : any) => {
        if(!parent.repostOfId){
            return null;
        }
        return await prisma.post.findFirst({
          where: {
            id: parent.repostOfId,
            ...buildVisiblePostWhere(ctx.session?.user?.id ?? null),
          },
          include: { author: true },
        });
     },

     commentsCount: async (parent: any, arg: any,ctx : any) => {
      const { prisma } = ctx;
      return await prisma.comment.count({
       where: {
       postId: parent.id,
      },
      });
     },

     isThreadPart: (parent: { threadRootId?: string | null }) =>
       Boolean(parent.threadRootId),

     threadPartCount: async (
       parent: { id: string; _count?: { threadParts?: number } },
       _args: unknown,
       ctx: { prisma: typeof prisma },
     ) => {
       if (typeof parent._count?.threadParts === "number") {
         return parent._count.threadParts;
       }
       return await ctx.prisma.post.count({
         where: { threadRootId: parent.id },
       });
     },

     thread: async (
       parent: { id: string; threadRootId?: string | null },
       _args: unknown,
       ctx: {
         prisma: typeof prisma;
         session?: { user?: { id?: string | null } | null } | null;
       },
     ) => {
       const { prisma } = ctx;
       const viewerId = ctx.session?.user?.id ?? null;
       const rootId = parent.threadRootId ?? parent.id;

       const root = await prisma.post.findFirst({
         where: { id: rootId, ...buildVisiblePostWhere(viewerId) },
         include: {
           author: true,
           _count: { select: { threadParts: true } },
         },
       });

       if (!root) {
         return [];
       }

       const parts = await prisma.post.findMany({
         where: { threadRootId: rootId, ...buildVisiblePostWhere(viewerId) },
         include: {
           author: true,
           _count: { select: { threadParts: true } },
         },
         orderBy: [{ threadPosition: "asc" }, { createdAt: "asc" }],
       });

       return [root, ...parts];
     },

  },  
    
    Mutation: {
    createPost : async (parent : any, args : any, ctx : any) => {
        
        if(!ctx.session?.user){
            throw new Error("Not authenticated!!")
        }; 

        const payload = parseInput(createPostSchema, args.payload);
            
        const post = await prisma.post.create({
            data: {
                content : payload.content,
                imgURL  : payload.imgURLs?.[0] ?? payload.imgURL ?? null,
                imgURLs : payload.imgURLs ?? (payload.imgURL ? [payload.imgURL] : []),
                visibility : payload.visibility,
                author  : {connect :{ id: ctx.session.user.id }}
            },
             include: {
               author: true,
            },
        });
        return post;
     },

    appendThreadPart : async (
      _parent: unknown,
      args: { postId: string; payload: { content?: string; imgURL?: string; imgURLs?: string[] } },
      ctx: { session?: { user?: { id?: string | null } | null } | null },
    ) => {
        const userId = ctx.session?.user?.id;
        if (!userId) {
            throw new Error("Not authenticated!!");
        }

        const { postId, payload } = parseInput(appendThreadPartSchema, args);

        const target = await prisma.post.findFirst({
            where: { id: postId, isHidden: false },
            select: { id: true, authorId: true, threadRootId: true, repostOfId: true },
        });
        if (!target) {
            throw new Error("Post not found");
        }
        if (target.authorId !== userId) {
            throw new Error("Unauthorized");
        }
        if (target.repostOfId) {
            throw new Error("Reposts cannot start a thread.");
        }

        const rootId = target.threadRootId ?? target.id;
        const root = await prisma.post.findFirst({
            where: { id: rootId, isHidden: false },
            select: { id: true, authorId: true, visibility: true },
        });
        if (!root) {
            throw new Error("Thread not found");
        }
        if (root.authorId !== userId) {
            throw new Error("Unauthorized");
        }

        const partCount = await prisma.post.count({
            where: { threadRootId: rootId },
        });
        if (partCount >= MAX_THREAD_PARTS) {
            throw new Error(`A thread can have at most ${MAX_THREAD_PARTS} parts.`);
        }

        const lastPart = await prisma.post.findFirst({
            where: { threadRootId: rootId },
            orderBy: { threadPosition: "desc" },
            select: { threadPosition: true },
        });

        const part = await prisma.post.create({
            data: {
                content: payload.content,
                imgURL: payload.imgURLs?.[0] ?? payload.imgURL ?? null,
                imgURLs: payload.imgURLs ?? (payload.imgURL ? [payload.imgURL] : []),
                visibility: root.visibility,
                author: { connect: { id: userId } },
                threadRoot: { connect: { id: rootId } },
                threadPosition: (lastPart?.threadPosition ?? 0) + 1,
            },
            include: {
                author: true,
            },
        });

        return part;
    },

    deleteThreadPart : async (
      _parent: unknown,
      args: { postId: string },
      ctx: { session?: { user?: { id?: string | null } | null } | null },
    ) => {
        const userId = ctx.session?.user?.id;
        if (!userId) {
            throw new Error("Not authenticated!!");
        }

        const { postId } = parseInput(postIdArgsSchema, args);

        const part = await prisma.post.findFirst({
            where: { id: postId, isHidden: false },
            select: {
                id: true,
                authorId: true,
                threadRootId: true,
                threadPosition: true,
            },
        });
        if (!part) {
            throw new Error("Post not found");
        }
        if (part.authorId !== userId) {
            throw new Error("Unauthorized");
        }
        if (!part.threadRootId) {
            throw new Error("This post is not part of a thread. Use deletePost for the thread root.");
        }

        await prisma.$transaction([
            prisma.post.delete({ where: { id: part.id } }),
            prisma.post.updateMany({
                where: {
                    threadRootId: part.threadRootId,
                    threadPosition: { gt: part.threadPosition ?? 0 },
                },
                data: { threadPosition: { decrement: 1 } },
            }),
        ]);

        return true;
    },

    deletePost : async (parent : any, args : {postId : string}, ctx : any) => {
        if(!ctx.session?.user){
            throw new Error("Not authenticated!!")
        };

        const { postId } = parseInput(postIdArgsSchema, args);
        
        const post = await prisma.post.findFirst({
          where : {
             id: postId,
             isHidden: false,
          }
        });

        if(!post){
          throw new Error("Post not found");
        };

        if (post?.authorId !== ctx.session?.user?.id) {
         throw new Error("Unauthorized");
        };

        await prisma.post.delete({
          where : {
            id : postId
          }
        });

        return true;
    }, 

    editPost : async (parent : any, args : any, ctx : any) => {
        if(!ctx.session?.user){
            throw new Error("Not authenticated!!")
        };

        const payload = parseInput(editPostSchema, args.payload);

        const post = await prisma.post.findFirst({
          where : {
             id: payload.postId,
             isHidden: false,
          }
        });

        if(!post){
          throw new Error("Post not found");
        };

        if (post?.authorId !== ctx.session?.user?.id) {
        throw new Error("Unauthorized");
        };

        const nextVisibility = payload.visibility;

        if (post.threadRootId && nextVisibility && nextVisibility !== post.visibility) {
          throw new Error("Visibility is controlled by the thread root.");
        }

        if (
          nextVisibility &&
          nextVisibility !== "PUBLIC" &&
          post.visibility === "PUBLIC"
        ) {
          await prisma.post.deleteMany({
            where: { repostOfId: post.id },
          });
        }

        const updatePost = await prisma.$transaction(async (tx) => {
          if (nextVisibility && nextVisibility !== post.visibility) {
            await tx.post.updateMany({
              where: { threadRootId: post.id },
              data: { visibility: nextVisibility },
            });
          }

          return tx.post.update({
            where : {
               id : payload.postId,
            },
            data : {
               content : payload.content, 
               imgURL  : payload.imgURLs?.[0] ?? payload.imgURL ?? null,
               imgURLs : payload.imgURLs ?? (payload.imgURL ? [payload.imgURL] : []),
               visibility : nextVisibility,
            },
            include: {
                 author: true,
              },
          });
        });

        return updatePost;
    },

    updatePostVisibility : async (_parent: unknown, args : {postId : string, visibility : "PUBLIC" | "FOLLOWERS" | "PRIVATE"}, ctx : { session?: { user?: { id: string } | null } | null }) => {
        if(!ctx.session?.user){
            throw new Error("Not authenticated!!")
        };

        const { postId, visibility } = parseInput(updatePostVisibilitySchema, args);

        const post = await prisma.post.findFirst({
          where: { id: postId, isHidden: false },
        });

        if(!post){
          throw new Error("Post not found");
        };

        if (post.authorId !== ctx.session.user.id) {
          throw new Error("Unauthorized");
        };

        if (post.repostOfId) {
          throw new Error("Reposts use the original post's visibility");
        }

        if (post.threadRootId) {
          throw new Error("Visibility is controlled by the thread root.");
        }

        if (post.visibility === "PUBLIC" && visibility !== "PUBLIC") {
          await prisma.post.deleteMany({
            where: { repostOfId: post.id },
          });
        }

        return await prisma.$transaction(async (tx) => {
          await tx.post.updateMany({
            where: { threadRootId: post.id },
            data: { visibility },
          });

          return tx.post.update({
            where: { id: post.id },
            data: { visibility },
            include: { author: true },
          });
        });
    },

    likePost : async (parent : any, args : {postId : string}, ctx : any) => {
      if(!ctx.session?.user){
          throw new Error("Not authenticated!!")
      }; 
       const { postId } = parseInput(postIdArgsSchema, args);
       const userId = ctx.session?.user?.id;

       const post = await prisma.post.findFirst({
        where: { id: postId, ...buildVisiblePostWhere(userId) },
       });
       if (!post) {
         throw new Error("Post not found");
       }
       if (post.threadRootId) {
         throw new Error("Engage with the thread root.");
       }

       const existingLike = await prisma.like.findUnique({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
       });

       await prisma.like.upsert({
        where : {
          userId_postId: {
          userId,
          postId,
          },
         },
         update: {},
         create: {
         userId,
         postId,
         },
        });
       
       if (!existingLike && post) {
         await createNotification({
           type: "LIKE",
           recipientId: post.authorId,
           actorId: userId,
           postId: post.id,
         });
       }
        
       return post;
    },
    
    unlikePost : async (parent : any, args : {postId : string}, ctx : any) => {
      if(!ctx.session?.user){
          throw new Error("Not authenticated!!")
      };

      const { postId } = parseInput(postIdArgsSchema, args);
      const userId = ctx.session?.user?.id;
      const post = await prisma.post.findFirst({
        where: { id: postId },
      });
      if (!post) {
        throw new Error("Post not found");
      }
      if (post.threadRootId) {
        throw new Error("Engage with the thread root.");
      }

      try {
          await prisma.like.delete({
          where: {
            userId_postId: {
            userId,
            postId,
          }, 
          }
        });
      } catch (error) {
        console.log(error)
      }
      if (post) {
        await deleteNotification({
          type: "LIKE",
          recipientId: post.authorId,
          actorId: userId,
          postId: post.id,
        });
      }

      return await prisma.post.findFirst({
        where: { id: postId, ...buildVisiblePostWhere(userId) },
      });
    },

    bookmarkPost : async (parent : any, args : {postId : string}, ctx : any) => {
      if(!ctx.session?.user){
          throw new Error("Not authenticated!!")
      };
      const { postId } = parseInput(postIdArgsSchema, args);
      const userId = ctx.session?.user?.id;
      const post = await prisma.post.findFirst({
        where: { id: postId, ...buildVisiblePostWhere(userId) },
      });
      if (!post) {
        throw new Error("Post not found");
      }
      if (post.threadRootId) {
        throw new Error("Engage with the thread root.");
      }

      await prisma.bookmark.upsert({
        where : {
          userId_postId: { userId, postId },
        },
        update: {},
        create: { userId, postId },
      });

      return post;
    },

    unbookmarkPost : async (parent : any, args : {postId : string}, ctx : any) => {
      if(!ctx.session?.user){
          throw new Error("Not authenticated!!")
      };
      const { postId } = parseInput(postIdArgsSchema, args);
      const userId = ctx.session?.user?.id;

      const post = await prisma.post.findFirst({
        where: { id: postId },
      });
      if (!post) {
        throw new Error("Post not found");
      }
      if (post.threadRootId) {
        throw new Error("Engage with the thread root.");
      }

      try {
        await prisma.bookmark.delete({
          where: { userId_postId: { userId, postId } },
        });
      } catch (error) {
        console.log(error)
      }

      return await prisma.post.findFirst({
        where: { id: postId, ...buildVisiblePostWhere(userId) },
      });
    },

    repostPost : async (parent : any, args : {postId : string}, ctx : any) => {
      if(!ctx.session?.user){
          throw new Error("Not authenticated!!")
      };
      const { postId } = parseInput(postIdArgsSchema, args);
      const userId = ctx.session?.user?.id;

      const source = await prisma.post.findFirst({
        where: { id: postId, ...buildVisiblePostWhere(userId) },
      });
      if(!source){
        throw new Error("Post not found");
      };
      if (source.threadRootId) {
        throw new Error("Repost the thread root instead.");
      }

      const targetId = source.repostOfId ?? source.id;
      const original = source.repostOfId
        ? await prisma.post.findFirst({
            where: { id: targetId, ...buildVisiblePostWhere(userId) },
          })
        : source;
      if (!original) {
        throw new Error("Post not found");
      }
      if (original.threadRootId) {
        throw new Error("Repost the thread root instead.");
      }
      if (original.visibility !== "PUBLIC") {
        throw new Error("Only public posts can be reposted");
      }

      const existingRepost = await prisma.post.findUnique({
        where : {
          authorId_repostOfId: { authorId : userId, repostOfId : targetId },
        },
      });

      await prisma.post.upsert({
        where : {
          authorId_repostOfId: { authorId : userId, repostOfId : targetId },
        },
        update: {},
        create: { content: "", authorId : userId, repostOfId : targetId, visibility: "PUBLIC" },
      });

      if (!existingRepost && original) {
        await createNotification({
          type: "REPOST",
          recipientId: original.authorId,
          actorId: userId,
          postId: original.id,
        });
      }

      return await prisma.post.findFirst({
        where: { id: targetId, ...buildVisiblePostWhere(userId) },
      });
    },

    unrepostPost : async (parent : any, args : {postId : string}, ctx : any) => {
      if(!ctx.session?.user){
          throw new Error("Not authenticated!!")
      };
      const { postId } = parseInput(postIdArgsSchema, args);
      const userId = ctx.session?.user?.id;

      const source = await prisma.post.findUnique({ where: { id: postId } });
      if (source?.threadRootId) {
        throw new Error("Repost the thread root instead.");
      }
      const targetId = source?.repostOfId ?? postId;

      await prisma.post.deleteMany({
        where: { authorId : userId, repostOfId : targetId },
      });

      if (source) {
        await deleteNotification({
          type: "REPOST",
          actorId: userId,
          postId: targetId,
        });
      }

      return await prisma.post.findFirst({
        where: { id: targetId, ...buildVisiblePostWhere(userId) },
      });
    }
   },
   Query: postQueries
};
