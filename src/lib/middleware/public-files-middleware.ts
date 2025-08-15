import { serveStatic } from "@hono/node-server/serve-static";
import type { MiddlewareHandler } from "hono";
import fs from "node:fs";

import { PUBLIC_DIR } from "@/constants.ts";

const STATIC_FILES = fs.readdirSync(PUBLIC_DIR);

/**
 * Vite serves files from the public directory as /[file].
 * To serve static files in hono we need a path to catch it an servie via `staticMiddleware`.
 * Since public files are served from the root we don't have a prefix path, thus we are
 * reading everything from public dir and check if this file is a public static file.
 */
export const publicFilesMiddleware = (opts?: {
  root?: string;
}): MiddlewareHandler => {
  const { root } = { root: "./", ...opts };
  const staticMiddleware = serveStatic({ root });

  return async (c, next) => {
    if (STATIC_FILES.some((file) => c.req.path.endsWith(file))) {
      return staticMiddleware(c, next);
    }
    await next();
  };
};
