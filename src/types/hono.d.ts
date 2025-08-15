import "hono";

import type { LoggingProvider } from "@/lib/logging/types.ts";

declare module "hono" {
  interface ContextVariableMap {
    logger: LoggingProvider;
  }

  interface HonoRequest {
    origin: string;
  }
}
