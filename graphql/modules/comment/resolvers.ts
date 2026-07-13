import { commentQueries } from "./queries";


export const commentResolvers = {

    Mutation: {

        createComment : async (parent : any, {postId, content}: {postId : string, content : string}, ctx : any) => {
            if (!ctx?.session?.user) {
             throw new Error("Not authenticated");
            };
             
            const {prisma} = ctx;

            return await prisma.comment.create({
                data : {
                    postId,
                    content,
                    authorId : ctx?.session?.user?.id
                    
                }
             })
        },

        deleteComment : async (parent : any, {postId}: {postId : string}, ctx : any) => {
            
        }
    },

    Query : commentQueries
};