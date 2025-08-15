import { zValidator } from "@hono/zod-validator";

import { ValidationError } from "@/lib/error/base.ts";

type ZValidator = typeof zValidator;

// @ts-expect-error hono MiddlewareHandler miss match
export const zodValidatorMiddleware: ZValidator = (
  target,
  schema,
  hook,
  options,
) => {
  if (hook) {
    return zValidator(target, schema, hook, options);
  }

  return zValidator(
    target,
    schema,
    (result) => {
      if (!result.success) {
        // @ts-expect-error zod version missmatch
        throw new ValidationError({ context: target, cause: result.error });
      }
    },
    options,
  );
};
