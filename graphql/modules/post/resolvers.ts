import prisma from "@/lib/prisma";
import { postQueries } from "./queries";





export const postResolvers= {
    Mutation: {
    createPost:async (parent : any, payload : any, ctx:any) => {
        
        if(!ctx.session?.user){
            throw new Error("Not authenticated!!")
        }; 
            
            const user = await prisma.user.findUnique({
             where: {
              email: ctx.session.user.email,
               },
             });
             

           if (!user) {
             throw new Error("User not found in database");
              }      
               
        const post = await prisma.post.create({
            data: {
                content : payload.payload.content,
                imgURL  : payload.payload.imgURL || null,
                author  : {connect :{ id: user.id }}
            },
             include: {
               author: true,
            },
        });
        
        return post;
     }
   },
   Query: postQueries
};

