import prisma from "@/lib/prisma";
import { userQueries } from "./queries";
import cloudinary from "@/lib/cloudinary";
import { createNotification, deleteNotification } from "../notification/helpers";
import { requestAccountDeletion } from "@/lib/accountDeletion";
import {
  followUserSchema,
  parseInput,
  updateProfileImageSchema,
} from "@/lib/validation";
import { buildThreadRootWhere, buildVisiblePostWhere } from "../post/visibility";


export const userResolvers = {
  User: {
    username: (parent: { username: string; accountStatus?: string }) =>
      parent.accountStatus === "DELETED" ? "Deleted account" : parent.username,

    email: (parent: { email: string; accountStatus?: string }) =>
      parent.accountStatus === "DELETED" ? "" : parent.email,

    posts: async (parent: { id: string }, _args: unknown, ctx: any) =>
      ctx.prisma.post.findMany({
        where: {
          authorId: parent.id,
          ...buildVisiblePostWhere(ctx.session?.user?.id ?? null),
          ...buildThreadRootWhere(),
        },
        include: {
          _count: { select: { threadParts: true } },
        },
        orderBy: { createdAt: "desc" },
      }),

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
    requestAccountDeletion: async (_parent: unknown, _args: unknown, ctx: any) => {
      const userId = ctx.session?.user?.id;
      if (!userId) {
        throw new Error("Not authenticated");
      }

      const deletionScheduledAt = await requestAccountDeletion(userId);
      return deletionScheduledAt.toISOString();
    },

    
    followUser : async (parent : any, args : {to : string}, ctx : any) => {
        
      if(!ctx.session?.user){
            throw new Error("Not authenticated!!")
        }; 
      const { to } = parseInput(followUserSchema, args);
      const userId = ctx.session?.user?.id
      const follow = await prisma.follows.create({
        data:{
          follower : { connect: {id : userId} },
          following : { connect: {id : to} }
        }
      });

      await createNotification({
        type: "FOLLOW",
        recipientId: to,
        actorId: userId,
      });

      return follow;  
    },
    
    unfollowUser : async (parent : any, args : {to : string}, ctx : any) => {
      
      if(!ctx.session?.user){
            throw new Error("Not authenticated!!")
        }; 
      const { to } = parseInput(followUserSchema, args);
      const userId = ctx.session?.user?.id

      const follow = await prisma.follows.delete({
        where:{
          followerId_followingId: {followerId : userId, followingId : to}
        }
      });

      await deleteNotification({
        type: "FOLLOW",
        recipientId: to,
        actorId: userId,
      });

      return follow;
    },

    updateProfileImage : async (parent : any, args : {profileImgUrl  : string, profileImgPublicId? : string | null }, ctx : any) => {

      if(!ctx.session?.user){
          throw new Error("Not authenticated!!")
      }; 

      const { profileImgUrl, profileImgPublicId } = parseInput(updateProfileImageSchema, args);

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

    },
            
  },
  
  Query: userQueries,

};  