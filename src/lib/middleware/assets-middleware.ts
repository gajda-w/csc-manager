import { serveStatic } from "@hono/node-server/serve-static";
import type { MiddlewareHandler } from "hono";

import { ASSETS_PATH } from "@/constants.ts";

export const nodeAssetsMiddleware = (opts?: {
  root?: string;
  path?: string;
}): MiddlewareHandler => {
  const { root, path } = { path: ASSETS_PATH, root: "./", ...opts };
  const staticMiddleware = serveStatic({ root });

  return async (c, next) => {
    if (c.req.path.startsWith(path)) {
      return staticMiddleware(c, next);
    }
    await next();
  };
};
