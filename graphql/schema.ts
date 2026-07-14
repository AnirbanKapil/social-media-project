
import { userModule } from "./modules/user";
import { postModule } from "./modules/post";
import { messageModule } from "./modules/message";
import { commentModule } from "./modules/comment";

export const typeDefs = [
  userModule.typeDefs,
  postModule.typeDefs,
  messageModule.typeDefs,
  commentModule.typeDefs
];

export const resolvers = [
  userModule.resolvers,
  postModule.resolvers,
  messageModule.resolvers,
  commentModule.resolvers
];

