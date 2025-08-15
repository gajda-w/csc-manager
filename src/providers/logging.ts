import { z } from "zod";

import { LOGGING_REDACT_KEYS } from "@/constants.ts";
import { baseConfigSchema } from "@/lib/config/schema.ts";
import { prepareConfig } from "@/lib/config/util.ts";
import { consolaLoggingProvider } from "@/lib/logging/provider/consola.ts";
import { LOG_LEVELS, type LoggingMetadata } from "@/lib/logging/types.ts";

const CONFIG = prepareConfig({
  name: "loggingProvider",
  schema: z
    .object({ LOG_LEVEL: z.enum(LOG_LEVELS).optional().default("error") })
    .and(baseConfigSchema.pick({ IS_DEVELOPMENT: true, ENVIRONMENT: true })),
});

export const getLogger = (metadata?: LoggingMetadata) => {
  const extraMetadata = { ...metadata };

  if (!CONFIG.IS_DEVELOPMENT) {
    extraMetadata.environment = CONFIG.ENVIRONMENT;
  }

  return consolaLoggingProvider({
    redactKeys: CONFIG.IS_DEVELOPMENT ? [] : LOGGING_REDACT_KEYS,
    level: CONFIG.LOG_LEVEL,
    pretty: CONFIG.IS_DEVELOPMENT,
    metadata: extraMetadata,
  });
};
