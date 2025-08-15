import type { ErrorHandler } from "hono";

import { HttpError } from "./base.ts";
import { isError } from "./helpers.ts";
import { jsonErrorSchema } from "./schema.ts";

export const errorHandler: ErrorHandler = (error, context) => {
  const requestId = context.get("requestId");
  const logger = context.get("logger");
  const serializedError = {
    ...error,
    name: error.name,
    message: error.message,
    stack: error.stack,
    cause: error.cause,
  };

  if (isError(error, HttpError)) {
    logger.debug("Error caught.", serializedError);

    return context.json({ requestId, ...error.serialize() }, error.status);
  }

  logger.error("Unhandled error.", serializedError);

  return context.json(
    jsonErrorSchema.parse({
      detail: "Internal server error",
      requestId,
      statusCode: 500,
    }),
    500,
  );
};
