
import {
  getUserByUsernameSchema,
  parseInput,
  searchUsersSchema,
  suggestedUsersSchema,
} from "@/lib/validation";

export const userQueries = {
  
  users: async (_: any, __: any, { prisma , session }: any) => {
  if (!session) {
    throw new Error("Not logged in");
  }
    return prisma.user.findMany();
  },
  
  currUser: async (_: any, __:any, { prisma, session }: any) => {
  if (!session?.user?.email) throw new Error("Invalid session");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {Posts: true}
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
      where: { username },
      include: {Posts: true}
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