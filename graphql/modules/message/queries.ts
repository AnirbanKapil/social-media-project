
import type { Prisma, PrismaClient } from "@/app/generated/prisma/client";
import { conversationIdArgsSchema, parseInput } from "@/lib/validation";

type MessageQueryContext = {
    session?: { user?: { id?: string | null } | null } | null;
    prisma: PrismaClient;
};

type Participation = {
    conversationId: string;
    lastReadAt: Date | null;
};

async function getUnreadCountsByConversation(
    prisma: PrismaClient,
    userId: string,
    participations: Participation[],
): Promise<Map<string, number>> {
    const counts = new Map<string, number>();
    if (participations.length === 0) return counts;

    const unreadFilters = participations.map((participant) => ({
        conversationId: participant.conversationId,
        senderId: { not: userId },
        ...(participant.lastReadAt
            ? { createdAt: { gt: participant.lastReadAt } }
            : {}),
    }));

    const grouped = await prisma.message.groupBy({
        by: ["conversationId"],
        where: { OR: unreadFilters },
        _count: { _all: true },
    });

    for (const row of grouped) {
        counts.set(row.conversationId, row._count._all);
    }

    return counts;
}

export async function getUnreadCountForConversation(
    prisma: PrismaClient,
    userId: string,
    conversationId: string,
): Promise<number> {
    const participant = await prisma.conversationParticipant.findUnique({
        where: {
            conversationId_userId: {
                conversationId,
                userId,
            },
        },
        select: {
            conversationId: true,
            lastReadAt: true,
            leftAt: true,
        },
    });

    if (!participant || participant.leftAt) return 0;

    const counts = await getUnreadCountsByConversation(prisma, userId, [participant]);
    return counts.get(conversationId) ?? 0;
}

export const messageQueries = {
    getConversations : async (_parent : unknown, _args : unknown, ctx : MessageQueryContext) => {
        const userId = ctx.session?.user?.id;
        if (!userId) {
          throw new Error("Not authenticated");
        }

        const { prisma } = ctx; 
        try {
            const conversations: Prisma.ConversationGetPayload<{
                include: { messages: true };
            }>[] = await prisma.conversation.findMany({
                where: {
                participants: {
                some: {
                userId,
                leftAt: null,
            },
          },
         },
                include: {
                    messages: {
                        orderBy: {
                            createdAt: "desc",
                        },
                        take: 1,
                    },
                },
        });  

            const participations = await prisma.conversationParticipant.findMany({
                where: {
                    userId,
                    leftAt: null,
                    conversationId: {
                        in: conversations.map((conversation) => conversation.id),
                    },
                },
                select: {
                    conversationId: true,
                    lastReadAt: true,
                },
            });

            const unreadCounts = await getUnreadCountsByConversation(
                prisma,
                userId,
                participations,
            );

            return conversations
                .sort((a, b) => {
                    const aTime = a.messages[0]?.createdAt ?? a.createdAt;
                    const bTime = b.messages[0]?.createdAt ?? b.createdAt;
                    return bTime.getTime() - aTime.getTime();
                })
                .map((conversation) => ({
                    ...conversation,
                    unreadCount: unreadCounts.get(conversation.id) ?? 0,
                }));
        } catch (error) {
            console.log("Failed to fetch messages:", error)
            throw new Error("Internal Server Error");
        }
    },
    
    getMessages : async (_parent : unknown, args: { conversationId: string }, ctx : MessageQueryContext) => {
        const userId = ctx.session?.user?.id;
        if (!userId) {
          throw new Error("Not authenticated");
        }

        const { conversationId } = parseInput(conversationIdArgsSchema, args);
        const { prisma } =  ctx ;

        const participant = await prisma.conversationParticipant.findUnique({
            where: {
                conversationId_userId: {
                    conversationId,
                    userId,
                },
            },
            select: {
                leftAt: true,
            },
        });

        if (!participant || participant.leftAt) {
          throw new Error("You are not a participant in this conversation.");
        }
          
        try {
            return await prisma.message.findMany({
            where : {
                conversationId
            },
            orderBy : {
                createdAt : "asc"
            }
          })
        } catch (error) {
            console.log("Failed to fetch messages:", error)
            throw new Error("Internal Server Error"); 
        }
    },

    unreadMessageCount : async (_parent : unknown, _args : unknown, ctx : MessageQueryContext) => {
        const userId = ctx.session?.user?.id;
        if (!userId) {
          throw new Error("Not authenticated");
        }

        const { prisma } = ctx;

        const participations: Participation[] = await prisma.conversationParticipant.findMany({
            where: { userId, leftAt: null },
            select: {
                conversationId: true,
                lastReadAt: true,
            },
        });

        const unreadCounts = await getUnreadCountsByConversation(
            prisma,
            userId,
            participations,
        );

        let total = 0;
        for (const count of unreadCounts.values()) {
            total += count;
        }
        return total;
    }
}
