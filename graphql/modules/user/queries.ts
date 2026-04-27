
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
    where: { email: session.user.email }
  });
  if (!user) {
  throw new Error("User not found in DB");
  };
  return user;
  }
};