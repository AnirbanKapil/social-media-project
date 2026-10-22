
import { userModule } from "./modules/user";
import { postModule } from "./modules/post";
import { messageModule } from "./modules/message";
import { commentModule } from "./modules/comment";
import { notificationModule } from "./modules/notification";

export const typeDefs = [
  userModule.typeDefs,
  postModule.typeDefs,
  messageModule.typeDefs,
  commentModule.typeDefs,
  notificationModule.typeDefs
];

export const resolvers = [
  userModule.resolvers,
  postModule.resolvers,
  messageModule.resolvers,
  commentModule.resolvers,
  notificationModule.resolvers
];

