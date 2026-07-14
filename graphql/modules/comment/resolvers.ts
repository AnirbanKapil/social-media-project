import { commentQueries } from "./queries";


export const commentResolvers = {
    
    Comment: {
       
        author: async (parent: any, _args : any, ctx : any) => {

        const {prisma} = ctx;

        return await prisma.user.findUnique({
            where : {
                id : parent.authorId
            }
        });
        },
        

    },

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

        deleteComment : async (parent : any, {commentId}: {commentId : string}, ctx : any) => {
           if (!ctx?.session?.user) {
             throw new Error("Not authenticated");
            };
            
            const {prisma} = ctx;

            const comment = await prisma.comment.findUnique({
                where: {
                  id: commentId,
                 },
            });
            
            if(!comment){
                throw new Error("Comment not found");
            };
            
            if(comment.authorId !== ctx?.session?.user.id){
                throw new Error("Unauthorized")
            };

            await prisma.comment.delete({
                where : {
                    id : commentId
                }
            });

            return true;
        }
    },

    Query : commentQueries
};