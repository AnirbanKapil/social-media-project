import { postTypeDefs } from "./typeDefs";
import { postResolvers } from "./resolvers";
import { mutations } from "./mutations";



export const postModule = {
  typeDefs: postTypeDefs,
  resolvers: postResolvers,
  mutations
};