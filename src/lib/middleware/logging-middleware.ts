import { createMiddleware } from "hono/factory";

import type { LoggingProvider } from "@/lib/logging/types.ts";

export const loggingMiddleware = (logger: LoggingProvider) =>
  createMiddleware(async (context, next) => {
    context.set("logger", logger);

    const { method, path } = context.req;
    const requestId = context.get("requestId");
    const metadata = {
      method,
      requestId,
      path,
    };

    logger.debug("Incoming Request", metadata);

    await next();

    /**
     * Get response after all middleware were processed.
     */
    const response = context.res;
    const { status } = response;

    logger.debug("Outgoing Response", {
      status,
      requestId,
      path,
      method,
    });
  });
