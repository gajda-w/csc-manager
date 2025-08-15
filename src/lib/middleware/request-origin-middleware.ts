import { createMiddleware } from "hono/factory";

export const requestOriginMiddleware = () =>
  createMiddleware(async (context, next) => {
    const protocol = context.req.header("x-forwarded-proto") || "http";
    const host = context.req.header("host") || "localhost";

    context.req.origin = `${protocol}://${host}`;

    await next();
  });
