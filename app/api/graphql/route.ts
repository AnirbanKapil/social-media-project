import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/prisma";



const typeDefs = `#graphql
  type Query {
    sayHello: String
  }
`;

const resolvers = {
    Query : {
      sayHello : () => "Hello from Apollo!!"
    },
  };

// 3. Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// 4. Handler (Next.js App Router)
const handler = startServerAndCreateNextHandler(server,{
  context : async () => {
    const session = await getAuthSession();
    return{
      session,
      prisma
    }
  }
});

export { handler as GET, handler as POST };