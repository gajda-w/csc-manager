import type { MiddlewareHandler } from "hono";

export const healthCheckMiddleware = (opts?: {
  path?: string;
}): MiddlewareHandler => {
  const { path } = { path: "/healthcheck", ...opts };

  return async (c, next) => {
    if (c.req.path === path && c.req.method === "GET") {
      return c.json({ status: "ok" });
    }

    await next();
  };
};
