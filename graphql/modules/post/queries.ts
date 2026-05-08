
export const postQueries = {
    getAllPosts : async (_: any, __: any , prisma : any) => {
          const posts = await prisma.post.findMany({orderBy : {createdAt : "desc"}})
          
          return posts;
    }
}