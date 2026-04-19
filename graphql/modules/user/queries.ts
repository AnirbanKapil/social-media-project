
export const userQueries = {
  users: async (_: any, __: any, { prisma }: any) => {
    return prisma.user.findMany();
  },
};