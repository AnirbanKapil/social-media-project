import prisma from "@/lib/prisma";
import { userQueries } from "./queries";


export const userResolvers = {
  Mutation: {
    
    followUser : async (parent : any, {to}: {to : string}, ctx : any) => {
        
      if(!ctx.session?.user){
            throw new Error("Not authenticated!!")
        }; 
      const userId = ctx.session?.user?.id
      const follow = await prisma.follows.create({
        data:{
          follower : { connect: {id : userId} },
          following : { connect: {id : to} }
        }
      });
      return follow;  
    },
    
    unfollowUser : async (parent : any, {to}: {to : string}, ctx : any) => {
      
      if(!ctx.session?.user){
            throw new Error("Not authenticated!!")
        }; 
      const userId = ctx.session?.user?.id

      return await prisma.follows.delete({
        where:{
          followerId_followingId: {followerId : userId, followingId : to}
        }
      })
    }
            
  },
  
  Query: userQueries,

};  