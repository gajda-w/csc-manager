import { isError } from "@/lib/error/helpers.ts";
import { HTTPException } from "hono/http-exception";
import { ZodError } from "zod";
import { type JsonError, jsonErrorSchema } from "./schema.ts";

/**
 * https://github.com/honojs/hono/blob/7e17b76ce9438d68072a271bd593f7d5deb8542b/src/http-exception.ts#L46
 */
// deno-lint-ignore no-explicit-any
export type HttpErrorOptions<C extends unknown = any> =
  & {
    res?: Response;
    message?: string;
  }
  & (C extends never ? { cause?: never; context?: never }
    : { cause: C; context?: string });

// deno-lint-ignore no-explicit-any
export class HttpError<C extends unknown = any> extends HTTPException {
  public override readonly cause: C;
  public readonly context: string | undefined;
  public readonly type: string;

  constructor(status: HTTPException["status"], options?: HttpErrorOptions<C>) {
    super(status, { message: options?.message, res: options?.res });
    this.cause = (options as HttpErrorOptions<C> & { cause: C })?.cause;
    this.context = (options as HttpErrorOptions<C> & { context: C })?.context;
    this.type = this.constructor.name;
  }

  serialize(): JsonError {
    return jsonErrorSchema.parse({
      detail: this.message,
      statusCode: this.status,
    });
  }
}

export class UnauthorizedError extends HttpError {
  constructor(options?: HttpErrorOptions) {
    super(401, { message: "Unauthorized", ...options });
  }
}

export class UnauthorizedDomainError extends UnauthorizedError {
  constructor(options?: HttpErrorOptions) {
    super({ message: "Unauthorized domain.", ...options });
  }
}

// deno-lint-ignore no-explicit-any
export class BadRequestError<T = any> extends HttpError<T> {
  constructor(options?: HttpErrorOptions<T>) {
    super(400, { message: "Bad request", ...options } as HttpErrorOptions<T>);
  }
}

type ValidationErrorDetail = {
  code: string;
  message: string;
  path: (string | number | symbol)[];
};

type ValidationErrorCause =
  | ValidationErrorDetail
  | ValidationErrorDetail[]
  | ZodError;

export class ValidationError extends BadRequestError<ValidationErrorCause> {
  constructor(options: HttpErrorOptions<ValidationErrorCause>) {
    super({ message: "Validation error", ...options });
  }

  override serialize(): JsonError {
    const { cause, message: detail, status, context } = this;

    const issues: ValidationErrorDetail[] = (() => {
      if (isError(cause, ZodError)) {
        return cause.issues.map((issue) => ({
          code: issue.code,
          message: issue.message,
          path: issue.path,
        }));
      }

      return [cause].flat();
    })();

    return jsonErrorSchema.parse({
      detail: detail,
      statusCode: status,
      errors: issues.map(({ message, code, path }) => ({
        code: code.toUpperCase().replaceAll(" ", "_"),
        path: path.join("."),
        context,
        message,
      })),
    });
  }
}
