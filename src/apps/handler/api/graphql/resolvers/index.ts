import { Mutation } from "./mutations/index.ts";
import { Query } from "./queries/index.ts";
import { loaders, types } from "./types/index.ts";

export const resolvers = {
  Query,
  Mutation,
  ...types,
};

export { loaders };
