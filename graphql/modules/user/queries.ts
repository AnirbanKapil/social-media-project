
import {
  getUserByUsernameSchema,
  parseInput,
  searchUsersSchema,
  suggestedUsersSchema,
} from "@/lib/validation";
import { buildThreadRootWhere, buildVisiblePostWhere } from "../post/visibility";

export const userQueries = {
  
  users: async (_: any, __: any, { prisma , session }: any) => {
  if (!session) {
    throw new Error("Not logged in");
  }
    return prisma.user.findMany({ where: { accountStatus: "ACTIVE" } });
  },
  
  currUser: async (_: any, __:any, { prisma, session }: any) => {
  if (!session?.user?.email) throw new Error("Invalid session");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      Posts: {
        where: { isHidden: false, ...buildThreadRootWhere() },
        include: { _count: { select: { threadParts: true } } },
      },
    },
  });
  if (!user) {
  throw new Error("User not found in DB");
  };
  return {
    ...user, posts: user.Posts || []
  };
  },

  getUserByUsername: async (_: any, args: { username: string }, { prisma, session }: any) => {
    if (!session) {
    throw new Error("Not logged in");
    };
    const { username } = parseInput(getUserByUsernameSchema, args);
    const user = await prisma.user.findUnique({
      where: { username, accountStatus: "ACTIVE" },
      include: {
        Posts: {
          where: {
            ...buildVisiblePostWhere(session.user.id),
            ...buildThreadRootWhere(),
          },
          include: { _count: { select: { threadParts: true } } },
          orderBy: { createdAt: "desc" },
        },
      }
    });       
    if (!user) {
      throw new Error("User not found");
    }
    return {...user, posts: user.Posts || []};
  },

  searchUsers: async (_: any, args: { keyword: string }, { prisma, session }: any) => {
    if (!session) {
    throw new Error("Not logged in");
    };

    const { keyword } = parseInput(searchUsersSchema, args);

    return await prisma.user.findMany({
      where: {
      accountStatus: "ACTIVE",
      id: {
        not: session.user.id,
      },
      username: {
        contains: keyword,
        mode: "insensitive",
      },
      },
      take: 10,
    })
  },

  suggestedUsers: async (
    _: any,
    args: { limit?: number },
    { prisma, session }: any,
  ) => {
    const userId = session?.user?.id;
    if (!userId) {
      throw new Error("Not logged in");
    }

    const { limit: safeLimit } = parseInput(suggestedUsersSchema, args);

    return await prisma.user.findMany({
      where: {
        accountStatus: "ACTIVE",
        id: {
          not: userId,
        },
        followings: {
          none: {
            followerId: userId,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: safeLimit,
    });
  }
}