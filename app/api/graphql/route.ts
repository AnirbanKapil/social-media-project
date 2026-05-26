import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { typeDefs, resolvers, } from "@/graphql/schema";
import { NextRequest } from 'next/server';


const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// 4. Handler (Next.js App Router)
const handler = startServerAndCreateNextHandler<NextRequest>(server,{
  context : async () => {
    const session = await getAuthSession();
    return{
      session,
      prisma
    }
  }
});

export { handler as GET, handler as POST };


