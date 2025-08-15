import DataLoader from "dataloader";
import { createSchema, createYoga } from "graphql-yoga";
import { type ExecutionContext, type HonoRequest, Hono } from "hono";

import { APP_CONFIG } from "@/apps/handler/config.ts";
import { loaders, resolvers } from "./resolvers/index.ts";
import typeDefs from "./schema.graphql?raw";

export const routes = new Hono();

export const schema = createSchema<null>({
  typeDefs,
  resolvers,
});

const yoga = createYoga<{ request: HonoRequest } & ExecutionContext>({
  schema,
  landingPage: false,
// deno-lint-ignore require-await
  context: async () => {
    return {
      loaders: {
        getUserByIds: new DataLoader(loaders.getUserByIdsLoader),
      },
    };
  },
  graphiql: {
    defaultQuery: "\n",
    title: `${APP_CONFIG.NAME} Graphql API`,
    shouldPersistHeaders: true,
  },

  plugins: [],
});

routes.on(["POST", "GET", "OPTIONS"], "/", (context) =>
  // @ts-ignore hono request url type missmatch
  yoga.fetch(context.req.raw, context.env)
);
