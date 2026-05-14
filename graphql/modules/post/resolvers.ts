import prisma from "@/lib/prisma";
import { postQueries } from "./queries";





export const postResolvers= {
    Mutation: {
    createPost:async (parent : any, payload : any, ctx:any) => {
        console.log("Creating post with payload:", payload.payload.content);
        if(!ctx.session?.user){
            throw new Error("Not authenticated!!")
        };
        
        const post = await prisma.post.create({
            data: {
                content : payload.payload.content,
                imgURL  : payload.payload.imgURL || null,
                author  : {connect :{ id: Number(ctx.session.user.id) }}
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

