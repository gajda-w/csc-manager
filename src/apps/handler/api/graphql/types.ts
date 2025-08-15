import type DataLoader from "dataloader";
import type { HonoRequest } from "hono";

import type { GraphqlResolver } from "@/lib/graphql/types.ts";
import type { User } from "./resolvers/types/user/types.ts";

export type Resolver<
  ReturnType,
  Parent = unknown,
  Args = unknown
> = GraphqlResolver<ReturnType, Parent, Args, Context>;

export type Replace<T, New> = {
  [K in keyof T]: K extends keyof New ? New[K] : T[K];
};

export type Context = {
  loaders: {
    getUserByIds: DataLoader<number, User>;
  };
  params: {
    extensions: object;
    operationName: string;
    query: string;
  };
  request: HonoRequest;
};
