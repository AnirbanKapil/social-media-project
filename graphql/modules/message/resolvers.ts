import type { PrismaClient } from "@/app/generated/prisma/client";
import { getUnreadCountForConversation, messageQueries } from "./queries"
import { publishRealtimeEvent } from "@/lib/realtime-events";
import {
  addGroupMembersSchema,
  conversationIdArgsSchema,
  createConversationSchema,
  createGroupConversationSchema,
  leaveGroupSchema,
  parseInput,
  removeGroupMemberSchema,
  renameGroupSchema,
  sendMessageSchema,
  setMemberRoleSchema,
  transferOwnershipSchema,
} from "@/lib/validation";

type ResolverContext = {
  session?: { user?: { id?: string | null } | null } | null;
  prisma: PrismaClient;
};

type ConversationRole = "OWNER" | "ADMIN" | "MEMBER";

type Membership = {
  conversationId: string;
  userId: string;
  role: ConversationRole;
  joinedAt: Date;
  lastReadAt: Date | null;
  leftAt: Date | null;
};

const ROLE_PRIORITY: Record<ConversationRole, number> = {
  OWNER: 0,
  ADMIN: 1,
  MEMBER: 2,
};

function requireAuth(ctx: ResolverContext): string {
  const userId = ctx.session?.user?.id;
  if (!userId) {
    throw new Error("Not authenticated");
  }
  return userId;
}

async function requireGroup(prisma: PrismaClient, conversationId: string) {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    select: { id: true, isGroup: true },
  });

  if (!conversation) {
    throw new Error("Conversation not found.");
  }
  if (!conversation.isGroup) {
    throw new Error("This conversation is not a group.");
  }

  return conversation;
}

async function requireActiveMembership(
  prisma: PrismaClient,
  conversationId: string,
  userId: string,
): Promise<Membership> {
  const membership = await prisma.conversationParticipant.findUnique({
    where: { conversationId_userId: { conversationId, userId } },
  });

  if (!membership || membership.leftAt) {
    throw new Error("You are not a participant in this conversation.");
  }

  return membership as Membership;
}

async function requireGroupManager(
  prisma: PrismaClient,
  conversationId: string,
  userId: string,
): Promise<Membership> {
  await requireGroup(prisma, conversationId);
  const membership = await requireActiveMembership(prisma, conversationId, userId);

  if (membership.role !== "OWNER" && membership.role !== "ADMIN") {
    throw new Error("Only group owners and admins can manage this group.");
  }

  return membership;
}

async function requireOwner(
  prisma: PrismaClient,
  conversationId: string,
  userId: string,
): Promise<Membership> {
  await requireGroup(prisma, conversationId);
  const membership = await requireActiveMembership(prisma, conversationId, userId);

  if (membership.role !== "OWNER") {
    throw new Error("Only the group owner can do this.");
  }

  return membership;
}

async function activeMemberIds(
  prisma: PrismaClient,
  conversationId: string,
): Promise<string[]> {
  const members = await prisma.conversationParticipant.findMany({
    where: { conversationId, leftAt: null },
    select: { userId: true },
  });

  return members.map((member) => member.userId);
}

async function notifyConversationUpdated(
  conversationId: string,
  recipientIds: string[],
) {
  await Promise.all(
    [...new Set(recipientIds)].map((recipientId) =>
      publishRealtimeEvent({
        type: "conversation.updated",
        recipientId,
        conversationId,
      }),
    ),
  );
}

async function getActorDisplayName(
  prisma: PrismaClient,
  userId: string,
): Promise<string | undefined> {
  const actor = await prisma.user.findUnique({
    where: { id: userId },
    select: { username: true, firstName: true, lastName: true },
  });

  return [actor?.firstName, actor?.lastName].filter(Boolean).join(" ") || actor?.username;
}

async function notifyMembersAdded(
  conversationId: string,
  conversationName: string | null,
  actorName: string | undefined,
  recipientIds: string[],
) {
  await Promise.all(
    [...new Set(recipientIds)].map((recipientId) =>
      publishRealtimeEvent({
        type: "conversation.member_added",
        recipientId,
        conversationId,
        conversationName: conversationName ?? undefined,
        actorName,
      }),
    ),
  );
}

async function assertActiveUsers(prisma: PrismaClient, userIds: string[]) {
  const users = await prisma.user.findMany({
    where: { id: { in: userIds }, accountStatus: "ACTIVE" },
    select: { id: true },
  });

  if (users.length !== userIds.length) {
    throw new Error("One or more selected users could not be found.");
  }
}

export const messageResolvers = {
    
    
    Conversation: {
     unreadCount: async (
       parent: { id: string; unreadCount?: number },
       _args: unknown,
       ctx: ResolverContext,
     ) => {
       if (typeof parent.unreadCount === "number") {
         return parent.unreadCount;
       }

       const userId = ctx.session?.user?.id;
       if (!userId) {
         return 0;
       }

       return getUnreadCountForConversation(ctx.prisma, userId, parent.id);
     },

     myRole: async (parent: { id: string }, _args: unknown, ctx: ResolverContext) => {
       const userId = ctx.session?.user?.id;
       if (!userId) {
         return null;
       }

       const membership = await ctx.prisma.conversationParticipant.findUnique({
         where: { conversationId_userId: { conversationId: parent.id, userId } },
         select: { role: true, leftAt: true },
       });

       return membership && !membership.leftAt ? membership.role : null;
     },

     memberCount: async (
       parent: { id: string },
       _args: unknown,
       ctx: ResolverContext,
     ) => {
       return ctx.prisma.conversationParticipant.count({
         where: { conversationId: parent.id, leftAt: null },
       });
     },

     members: async (parent: { id: string }, _args: unknown, ctx: ResolverContext) => {
       const members = await ctx.prisma.conversationParticipant.findMany({
         where: { conversationId: parent.id, leftAt: null },
         include: { user: true },
       });

       return members.sort((a, b) => {
         const roleDifference =
           ROLE_PRIORITY[a.role as ConversationRole] -
           ROLE_PRIORITY[b.role as ConversationRole];
         if (roleDifference !== 0) return roleDifference;
         return a.joinedAt.getTime() - b.joinedAt.getTime();
       });
     },

     participants: async (
       parent: { id: string },
       _args: unknown,
       ctx: ResolverContext,
     ) => {
      const participants = await ctx.prisma.conversationParticipant.findMany({
      where: {
        conversationId: parent.id,
        leftAt: null,
       },
        include: {
        user: true,
        },
       });

       return participants.map((p) => p.user);
     },

     messages : async (
       parent: { id: string },
       _args: unknown,
       ctx: ResolverContext,
     ) => {
        const { prisma } = ctx;

        return await prisma.message.findMany({
            where : {
                conversationId : parent.id
            },
            orderBy : {
                createdAt: "asc",
            }
        })
     },

     lastMessage : async (
       parent: { id: string },
       _args: unknown,
       ctx: ResolverContext,
     ) => {
        const { prisma } = ctx;

        return await prisma.message.findFirst({
            where : {
                conversationId : parent.id
            },
            orderBy : {
                createdAt : "desc"
            }
        })
     },
    },


    Message: {
     sender: async (
       parent: { senderId: string },
       _args: unknown,
       ctx: ResolverContext,
     ) => {
        const { prisma } = ctx;
        return await prisma.user.findUnique({
        where: {
             id: parent.senderId,
        },
      });
     },
    },
    
    Mutation: {

     createConversation : async (
       _parent: unknown,
       args: { userId: string },
       ctx: ResolverContext,
     ) => {
           const currentUserId = requireAuth(ctx);
           const { userId } = parseInput(createConversationSchema, args);
             
           if (currentUserId === userId) {
           throw new Error("You cannot create a conversation with yourself.");
           }

           const { prisma } = ctx;
           const otherUser= await prisma.user.findUnique({
            where : {
                id : userId
            }
           });
           if(!otherUser){
            throw new Error("User not found.");
           }

           const existingCandidates = await prisma.conversation.findMany({
            where : {
                isGroup : false,
                participants : {
                    some : {
                        userId : currentUserId,
                        leftAt : null,
                    }
                },
                AND : [
                    {
                        participants : {
                            some : {
                                userId,
                                leftAt : null,
                            }
                        }
                    },
                ]
            },
            include : {
                participants : {
                    where : {
                        leftAt : null,
                    },
                    select : {
                        userId : true,
                    },
                },
            },
           });

           const existingConversation = existingCandidates.find(
             (candidate) => candidate.participants.length === 2,
           );
            if (existingConversation) {
              return existingConversation;
            }

            const conversation = await prisma.conversation.create({
               data: {
                  participants : {
                          create: [
                                   {
                                   userId: currentUserId,
                                  },
                                  {
                                   userId,
                                  },
                                  ],
                    },
               },
            });

            return conversation;
     },

     createGroupConversation : async (
       _parent: unknown,
       args: { name: string; participantIds: string[] },
       ctx: ResolverContext,
     ) => {
       const currentUserId = requireAuth(ctx);
       const { name, participantIds } = parseInput(
         createGroupConversationSchema,
         args,
       );
       const { prisma } = ctx;

       const memberIds = participantIds.filter((id) => id !== currentUserId);
       if (memberIds.length === 0) {
         throw new Error("Select at least one other member.");
       }

       await assertActiveUsers(prisma, memberIds);

       const conversation = await prisma.conversation.create({
         data: {
           isGroup: true,
           name,
           participants: {
             create: [
               { userId: currentUserId, role: "OWNER" },
               ...memberIds.map((userId) => ({ userId, role: "MEMBER" as const })),
             ],
           },
         },
       });

       const actorName = await getActorDisplayName(prisma, currentUserId);
       await notifyConversationUpdated(conversation.id, memberIds);
       await notifyMembersAdded(
         conversation.id,
         conversation.name,
         actorName,
         memberIds,
       );

       return conversation;
     },

     addGroupMembers : async (
       _parent: unknown,
       args: { conversationId: string; userIds: string[] },
       ctx: ResolverContext,
     ) => {
       const currentUserId = requireAuth(ctx);
       const { conversationId, userIds } = parseInput(addGroupMembersSchema, args);
       const { prisma } = ctx;

       await requireGroupManager(prisma, conversationId, currentUserId);

       const targetIds = userIds.filter((id) => id !== currentUserId);
       if (targetIds.length === 0) {
         throw new Error("Select at least one other user.");
       }

       await assertActiveUsers(prisma, targetIds);

       const existingMembers = await prisma.conversationParticipant.findMany({
         where: {
           conversationId,
           userId: { in: targetIds },
           leftAt: null,
         },
         select: { userId: true },
       });
       const existingIds = new Set(existingMembers.map((member) => member.userId));
       const toAdd = targetIds.filter((id) => !existingIds.has(id));

       if (toAdd.length === 0) {
         throw new Error("Those users are already members of this group.");
       }

       await prisma.$transaction(
         toAdd.map((userId) =>
           prisma.conversationParticipant.upsert({
             where: { conversationId_userId: { conversationId, userId } },
             create: { conversationId, userId, role: "MEMBER" },
             update: {
               role: "MEMBER",
               leftAt: null,
               joinedAt: new Date(),
               lastReadAt: new Date(),
             },
           }),
         ),
       );

       const conversation = await prisma.conversation.update({
         where: { id: conversationId },
         data: { updatedAt: new Date() },
       });

       const actorName = await getActorDisplayName(prisma, currentUserId);
       await notifyConversationUpdated(
         conversationId,
         await activeMemberIds(prisma, conversationId),
       );
       await notifyMembersAdded(
         conversationId,
         conversation.name,
         actorName,
         toAdd,
       );

       return conversation;
     },

     removeGroupMember : async (
       _parent: unknown,
       args: { conversationId: string; userId: string },
       ctx: ResolverContext,
     ) => {
       const currentUserId = requireAuth(ctx);
       const { conversationId, userId } = parseInput(removeGroupMemberSchema, args);
       const { prisma } = ctx;

       const actor = await requireGroupManager(prisma, conversationId, currentUserId);

       if (userId === currentUserId) {
         throw new Error("Use leaveGroup to leave a group.");
       }

       const target = await requireActiveMembership(prisma, conversationId, userId);

       if (target.role === "OWNER") {
         throw new Error("The group owner cannot be removed.");
       }
       if (actor.role === "ADMIN" && target.role === "ADMIN") {
         throw new Error("Only the group owner can remove an admin.");
       }

       await prisma.conversationParticipant.update({
         where: { conversationId_userId: { conversationId, userId } },
         data: { leftAt: new Date() },
       });

       await prisma.conversation.update({
         where: { id: conversationId },
         data: { updatedAt: new Date() },
       });

       await notifyConversationUpdated(
         conversationId,
         [...(await activeMemberIds(prisma, conversationId)), userId],
       );

       return true;
     },

     setMemberRole : async (
       _parent: unknown,
       args: { conversationId: string; userId: string; role: ConversationRole },
       ctx: ResolverContext,
     ) => {
       const currentUserId = requireAuth(ctx);
       const { conversationId, userId, role } = parseInput(setMemberRoleSchema, args);
       const { prisma } = ctx;

       await requireOwner(prisma, conversationId, currentUserId);

       if (userId === currentUserId) {
         throw new Error("You cannot change your own role.");
       }

       const target = await requireActiveMembership(prisma, conversationId, userId);

       if (target.role === "OWNER") {
         throw new Error("The group owner's role cannot be changed.");
       }

       await prisma.conversationParticipant.update({
         where: { conversationId_userId: { conversationId, userId } },
         data: { role },
       });

       await prisma.conversation.update({
         where: { id: conversationId },
         data: { updatedAt: new Date() },
       });

       await notifyConversationUpdated(
         conversationId,
         await activeMemberIds(prisma, conversationId),
       );

       return true;
     },

     renameGroup : async (
       _parent: unknown,
       args: { conversationId: string; name: string },
       ctx: ResolverContext,
     ) => {
       const currentUserId = requireAuth(ctx);
       const { conversationId, name } = parseInput(renameGroupSchema, args);
       const { prisma } = ctx;

       await requireGroupManager(prisma, conversationId, currentUserId);

       const conversation = await prisma.conversation.update({
         where: { id: conversationId },
         data: { name },
       });

       await notifyConversationUpdated(
         conversationId,
         await activeMemberIds(prisma, conversationId),
       );

       return conversation;
     },

     transferOwnership : async (
       _parent: unknown,
       args: { conversationId: string; userId: string },
       ctx: ResolverContext,
     ) => {
       const currentUserId = requireAuth(ctx);
       const { conversationId, userId } = parseInput(transferOwnershipSchema, args);
       const { prisma } = ctx;

       await requireOwner(prisma, conversationId, currentUserId);

       if (userId === currentUserId) {
         throw new Error("You already own this group.");
       }

       await requireActiveMembership(prisma, conversationId, userId);

       await prisma.$transaction([
         prisma.conversationParticipant.update({
           where: { conversationId_userId: { conversationId, userId: currentUserId } },
           data: { role: "ADMIN" },
         }),
         prisma.conversationParticipant.update({
           where: { conversationId_userId: { conversationId, userId } },
           data: { role: "OWNER" },
         }),
       ]);

       await notifyConversationUpdated(
         conversationId,
         await activeMemberIds(prisma, conversationId),
       );

       return true;
     },

     leaveGroup : async (
       _parent: unknown,
       args: { conversationId: string },
       ctx: ResolverContext,
     ) => {
       const currentUserId = requireAuth(ctx);
       const { conversationId } = parseInput(leaveGroupSchema, args);
       const { prisma } = ctx;

       const membership = await requireActiveMembership(
         prisma,
         conversationId,
         currentUserId,
       );
       const conversation = await prisma.conversation.findUnique({
         where: { id: conversationId },
         select: { isGroup: true },
       });

       if (!conversation) {
         throw new Error("Conversation not found.");
       }
       if (conversation.isGroup && membership.role === "OWNER") {
         throw new Error("Transfer ownership or delete the group before leaving.");
       }

       await prisma.conversationParticipant.update({
         where: { conversationId_userId: { conversationId, userId: currentUserId } },
         data: { leftAt: new Date() },
       });

       await prisma.conversation.update({
         where: { id: conversationId },
         data: { updatedAt: new Date() },
       });

       await notifyConversationUpdated(
         conversationId,
         await activeMemberIds(prisma, conversationId),
       );

       return true;
     },

     deleteGroup : async (
       _parent: unknown,
       args: { conversationId: string },
       ctx: ResolverContext,
     ) => {
       const currentUserId = requireAuth(ctx);
       const { conversationId } = parseInput(conversationIdArgsSchema, args);
       const { prisma } = ctx;

       await requireOwner(prisma, conversationId, currentUserId);

       const recipientIds = await activeMemberIds(prisma, conversationId);

       await prisma.conversation.delete({ where: { id: conversationId } });

       await notifyConversationUpdated(conversationId, recipientIds);

       return true;
     },

     markConversationRead : async (
       _parent: unknown,
       args: { conversationId: string },
       ctx: ResolverContext,
     ) => {
        const userId = requireAuth(ctx);

        const { conversationId } = parseInput(conversationIdArgsSchema, args);
        const { prisma } = ctx;

        const participant = await prisma.conversationParticipant.findUnique({
            where : {
                conversationId_userId : {
                     conversationId,
                     userId
                }
            }
        });
        if (!participant || participant.leftAt) {
          throw new Error("You are not a participant in this conversation.");
        }

        await prisma.conversationParticipant.update({
            where : {
                conversationId_userId : {
                     conversationId,
                     userId
                }
            },
            data : {
                lastReadAt : new Date()
            }
        });

        return true;
     },

     sendMessage : async (
       _parent: unknown,
       args: { conversationId: string; content: string },
       ctx: ResolverContext,
     ) => {
        const currentUserId = requireAuth(ctx);

        const { conversationId, content } = parseInput(sendMessageSchema, args);
        const { prisma } = ctx;

        const participant = await prisma.conversationParticipant.findUnique({
            where : {
                conversationId_userId : {
                     conversationId,
                     userId : currentUserId
                }
            }
        });
        if (!participant || participant.leftAt) {
          throw new Error("You are not a participant in this conversation.");
        };

        const message = await prisma.message.create({
            data : {
                content,
                conversationId,
                senderId : currentUserId
            }
        });

        try {
            const participants = await prisma.conversationParticipant.findMany({
                where : {
                    conversationId,
                    leftAt : null,
                },
                select : {
                    userId: true,
                },
            });

            const sender = await prisma.user.findUnique({
                where : {
                    id : currentUserId,
                },
                select : {
                    username: true,
                    firstName: true,
                    lastName: true,
                },
            });

            const senderName =
                [sender?.firstName, sender?.lastName].filter(Boolean).join(" ") ||
                sender?.username;
            const preview =
                content.length > 140 ? `${content.slice(0, 140)}...` : content;

            await Promise.all(
                participants
                    .filter(({ userId }) => userId !== currentUserId)
                    .map(({ userId }) =>
                        publishRealtimeEvent({
                            type: "message.created",
                            recipientId: userId,
                            recordId: message.id,
                            conversationId,
                            senderUsername: sender?.username,
                            senderName,
                            preview,
                        }),
                    ),
            );
        } catch (error) {
            console.error(
                `Message "${message.id}" was saved, but realtime delivery could not be prepared:`,
                error,
            );
        }

        return message;
     }
    },
    Query : messageQueries
}
