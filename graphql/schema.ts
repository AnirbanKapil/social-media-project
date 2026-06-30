
import { userModule } from "./modules/user";
import { postModule } from "./modules/post";
import { messageModule } from "./modules/message";

export const typeDefs = [
  userModule.typeDefs,
  postModule.typeDefs,
  messageModule.typeDefs
];

export const resolvers = [
  userModule.resolvers,
  postModule.resolvers,
  messageModule.resolvers,
];

