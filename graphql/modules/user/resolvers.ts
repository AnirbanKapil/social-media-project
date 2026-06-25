import prisma from "@/lib/prisma";
import { userQueries } from "./queries";
import cloudinary from "@/lib/cloudinary";


export const userResolvers = {
  User: {
    isFollowing: async (parent : any, _args : any, ctx : any) => {
      const currentUserId = ctx.session?.user?.id;

      if (!currentUserId) return false;

      const follow = await ctx.prisma.follows.findUnique({
        where: {
          followerId_followingId: {
            followerId: currentUserId,
            followingId: parent.id,
          },
        },
      });

      return !!follow;
    },

    followersCount: async (parent : any,_args : any, ctx : any) => { 
      return await ctx.prisma.follows.count({
        where : {
          followingId : parent.id
        }
      })
    },
    
    followingCount: async (parent : any,_args : any, ctx : any) => {
      return await ctx.prisma.follows.count({
        where : {
          followerId : parent.id
        }
      })
    }
  },
  
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
    },

    updateProfileImage : async (parent : any, {profileImgUrl, profileImgPublicId}: {profileImgUrl  : string, profileImgPublicId : string }, ctx : any) => {

      if(!ctx.session?.user){
          throw new Error("Not authenticated!!")
      }; 
      const user = await prisma.user.findUnique({
       where: {
       id: ctx.session.user.id,
       },
      });
       const oldPublicId = user?.profileImgPublicId
       if (oldPublicId) {
       await cloudinary.uploader.destroy(
       oldPublicId
       );
       }

      return await prisma.user.update({
        where : {
          id : ctx.session?.user?.id
        },
        data : {
          profileImgUrl,
          profileImgPublicId
        }
      })  
    },

    removeProfileImage : async (parent : any, _args : any, ctx : any) => {
      
      if(!ctx.session?.user){
          throw new Error("Not authenticated!!")
      }; 
      const currUser = await prisma.user.findUnique({
       where: {
       id: ctx.session.user.id,
       },
      });
       const oldPublicId = currUser?.profileImgPublicId
       if (oldPublicId) {
       await cloudinary.uploader.destroy(
        oldPublicId
       );
       }
       return await prisma.user?.update({
        where : {
          id : currUser?.id 
        },
        data : {
          profileImgUrl : null,
          profileImgPublicId : null
        }
       })

    }
            
  },
  
  Query: userQueries,

};  