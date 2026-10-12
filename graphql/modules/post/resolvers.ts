import prisma from "@/lib/prisma";
import { postQueries } from "./queries";



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
            
        const post = await prisma.post.create({
            data: {
                content : args.payload.content,
                imgURL  : args.payload.imgURLs?.[0] ?? args.payload.imgURL ?? null,
                imgURLs : args.payload.imgURLs ?? (args.payload.imgURL ? [args.payload.imgURL] : []),
                author  : {connect :{ id: ctx.session.user.id }}
            },
             include: {
               author: true,
            },
        });
        return post;
     },

    deletePost : async (parent : any, {postId}: {postId : string}, ctx : any) => {
        if(!ctx.session?.user){
            throw new Error("Not authenticated!!")
        };
        
        const post = await prisma.post.findUnique({
          where : {
             id: postId,
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

    editPost : async (parent : any, { payload } : any, ctx : any) => {
        if(!ctx.session?.user){
            throw new Error("Not authenticated!!")
        };

        const post = await prisma.post.findUnique({
          where : {
             id: payload.postId,
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

    likePost : async (parent : any, {postId}: {postId : string}, ctx : any) => {
      if(!ctx.session?.user){
          throw new Error("Not authenticated!!")
      }; 
       const userId = ctx.session?.user?.id;

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
       
       const post = await prisma.post.findUnique({
        where: {
          id : postId
        }
       })
        
       return post;
    },
    
    unlikePost : async (parent : any, {postId} : {postId : string}, ctx : any) => {
      if(!ctx.session?.user){
          throw new Error("Not authenticated!!")
      };
      
      const userId = ctx.session?.user?.id;

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
      const post = await prisma.post.findUnique({
      where: { id: postId },
      });

      return post;
    }
   },
   Query: postQueries
};
