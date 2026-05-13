import prisma from "@/lib/prisma";
import { postQueries } from "./queries";





export const postResolvers= {
    Mutation: {
    createPost:async (parent : any, payload : any, ctx:any) => {

        if(!ctx.user){
            throw new Error("Not authenticated!!")
        };
        
        const post = await prisma.post.create({
            data: {
                content : payload.content,
                imgURL  : payload.imgURL,
                author  : {connect :{ id: ctx.user.id }}
            }
        });
        
        return post;
     }
   },
   Query: postQueries
};

