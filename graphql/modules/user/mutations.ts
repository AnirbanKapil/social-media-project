
export const userMutations = {
  createUser: async (_: any, args: any, { prisma }: any) => {
    return prisma.user.create({
      data: args,
    });
  },
};