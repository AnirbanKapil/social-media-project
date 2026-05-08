
import { userModule } from "./modules/user";
import { postModule } from "./modules/post";

export const typeDefs = [
  userModule.typeDefs,
  postModule.typeDefs
];

export const resolvers = [
  userModule.resolvers,
  postModule.resolvers
];

