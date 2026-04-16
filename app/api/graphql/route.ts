import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import prisma from "@/lib/prisma";



const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// 4. Handler (Next.js App Router)
const handler = startServerAndCreateNextHandler(server);

export { handler as GET, handler as POST };