import prisma from "@/lib/prisma";
import { postQueries } from "./queries";





export const postResolvers= {
    Mutation: {
    createPost:async (parent : any, payload : any, ctx : any) => {
        
        if(!ctx.session?.user){
            throw new Error("Not authenticated!!")
        }; 
            
        const post = await prisma.post.create({
            data: {
                content : payload.payload.content,
                imgURL  : payload.payload.imgURL || null,
                author  : {connect :{ id: ctx.session.user.id }}
            },
             include: {
               author: true,
            },
        });
        return post;
     },

    likePost : async (parent : any, {postId}: {postId : string}, ctx : any) => {
      if(!ctx.session?.user){
          throw new Error("Not authenticated!!")
      }; 
       const userId = ctx.session?.user?.id;
       const like = await prisma.like.upsert({
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
       
       return like;
    },
    
    unLikePost : async (parent : any, {postId} : {postId : string}, ctx : any) => {
      if(!ctx.session?.user){
          throw new Error("Not authenticated!!")
      };
      
      const userId = ctx.session?.user?.id;

      return await prisma.like.delete({
        where: {
          userId_postId: {
          userId,
          postId,
        }, 
        }
      });
      
    }
   },
   Query: postQueries
};

