import { HttpError, type HttpErrorOptions } from "@/lib/error/base.ts";
import { type JsonError, jsonErrorSchema } from "@/lib/error/schema.ts";
import type { GraphqlError } from "./types.ts";

export class GraphQLBaseError<T = unknown> extends HttpError<T> {
  constructor(options?: HttpErrorOptions) {
    super(400, { message: "Graphql error", ...options } as HttpErrorOptions<T>);
  }
}

export class GraphQLClientHttpError extends GraphQLBaseError {}

export class GraphQLClientInvalidResponseError extends GraphQLBaseError {}

export class GraphQLClientError extends GraphQLBaseError<GraphqlError[]> {
  constructor(options?: HttpErrorOptions<GraphqlError[]>) {
    super({ message: "Graphql error", ...options });
  }

  override serialize(): JsonError {
    return jsonErrorSchema.parse({
      detail: this.message,
      statusCode: this.status,
      errors: this.cause.map(({ message, path }) => ({
        context: path.join(" > "),
        message,
      })),
    });
  }
}
