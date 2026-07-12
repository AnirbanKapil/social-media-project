import prisma from "@/lib/prisma";
import { postQueries } from "./queries";



export const postResolvers= {

  Post: {
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
      }

  },  
    
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

