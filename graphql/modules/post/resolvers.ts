import prisma from "@/lib/prisma";
import { postQueries } from "./queries";
import { createNotification, deleteNotification } from "../notification/helpers";
import {
  createPostSchema,
  editPostSchema,
  parseInput,
  postIdArgsSchema,
} from "@/lib/validation";



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

     repostOf: async(parent : any) => {
        if(!parent.repostOfId){
            return null;
        }
        return await prisma.post.findFirst({
          where: {
            id: parent.repostOfId,
            isHidden: false,
            author: { accountStatus: "ACTIVE" },
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
                author  : {connect :{ id: ctx.session.user.id }}
            },
             include: {
               author: true,
            },
        });
        return post;
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

        const updatePost = await prisma.post.update({
          where : {
             id : payload.postId,
          },
          data : {
             content : payload.content, 
             imgURL  : payload.imgURLs?.[0] ?? payload.imgURL ?? null,
             imgURLs : payload.imgURLs ?? (payload.imgURL ? [payload.imgURL] : [])
          },
          include: {
               author: true,
            },
        });

        return updatePost;
    },

    likePost : async (parent : any, args : {postId : string}, ctx : any) => {
      if(!ctx.session?.user){
          throw new Error("Not authenticated!!")
      }; 
       const { postId } = parseInput(postIdArgsSchema, args);
       const userId = ctx.session?.user?.id;

       const post = await prisma.post.findFirst({
        where: { id: postId, isHidden: false },
       });
       if (!post) {
         throw new Error("Post not found");
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
        where: { id: postId, isHidden: false },
      });
      if (!post) {
        throw new Error("Post not found");
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

      return post;
    },

    bookmarkPost : async (parent : any, args : {postId : string}, ctx : any) => {
      if(!ctx.session?.user){
          throw new Error("Not authenticated!!")
      };
      const { postId } = parseInput(postIdArgsSchema, args);
      const userId = ctx.session?.user?.id;
      const post = await prisma.post.findFirst({
        where: { id: postId, isHidden: false },
      });
      if (!post) {
        throw new Error("Post not found");
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

      try {
        await prisma.bookmark.delete({
          where: { userId_postId: { userId, postId } },
        });
      } catch (error) {
        console.log(error)
      }

      return await prisma.post.findFirst({
        where: { id: postId, isHidden: false },
      });
    },

    repostPost : async (parent : any, args : {postId : string}, ctx : any) => {
      if(!ctx.session?.user){
          throw new Error("Not authenticated!!")
      };
      const { postId } = parseInput(postIdArgsSchema, args);
      const userId = ctx.session?.user?.id;

      const source = await prisma.post.findFirst({
        where: { id: postId, isHidden: false },
      });
      if(!source){
        throw new Error("Post not found");
      };

      const targetId = source.repostOfId ?? source.id;
      const original = source.repostOfId
        ? await prisma.post.findFirst({
            where: { id: targetId, isHidden: false },
          })
        : source;
      if (!original) {
        throw new Error("Post not found");
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
        create: { content: "", authorId : userId, repostOfId : targetId },
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
        where: { id: targetId, isHidden: false },
      });
    },

    unrepostPost : async (parent : any, args : {postId : string}, ctx : any) => {
      if(!ctx.session?.user){
          throw new Error("Not authenticated!!")
      };
      const { postId } = parseInput(postIdArgsSchema, args);
      const userId = ctx.session?.user?.id;

      const source = await prisma.post.findUnique({ where: { id: postId } });
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
        where: { id: targetId, isHidden: false },
      });
    }
   },
   Query: postQueries
};
