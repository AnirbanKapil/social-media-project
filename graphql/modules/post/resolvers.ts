import prisma from "@/lib/prisma";

interface CreatePostPayload {
   content: string;
   imgURL?: string;
}



const mutations = {
    createPost:async (parent:any, {payload}:{payload : CreatePostPayload}, ctx:any) => {

        if(!ctx.user){
            throw new Error("Not authenticated!!")
        };
        
        const post = await prisma.post.create({
            data: {
                content : payload.content,
                imgURL  : payload.imgURL,
                author  : {connect :{ id: ctx.user.id }}
            }
        })

        return post;

    }
};

export const postResolvers = { mutations }