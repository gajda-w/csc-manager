import type { DocumentTypeDecoration } from "@graphql-typed-document-node/core";

import { isEmptyObject } from "@/lib/core.ts";
import type { LoggingProvider } from "@/lib/logging/types.ts";
import { getElapsedTime } from "@/lib/misc.ts";
import type { Maybe } from "@/lib/types.ts";
import {
  GraphQLClientError,
  GraphQLClientHttpError,
  GraphQLClientInvalidResponseError,
} from "./error.ts";
import { getOperationName } from "./helpers.ts";
import type { AnyVariables, FetchOptions, GraphQLResponse } from "./types.ts";

export type GraphqlClient = ReturnType<typeof graphqlClient>;

export type GraphqlClientOptions = Parameters<typeof graphqlClient>[1];

export const logExecution = (logger: LoggingProvider) =>
({
  elapsedTime,
  variables,
  operationName,
}: {
  operationName: string;
  elapsedTime: string;
  variables: unknown;
}) =>
  logger.info(
    `Executed ${operationName} operation, took ${elapsedTime}.`,
    isEmptyObject(variables) ? undefined : { variables },
  );

export const graphqlClient = (
  url: string,
  opts?: {
    authToken?: Maybe<string>;
    timeout?: number;
    logger?: LoggingProvider;
  },
) => ({
  execute: async <
    TResult = unknown,
    TVariables extends AnyVariables = AnyVariables,
  >(
    query: DocumentTypeDecoration<TResult, TVariables> & { toString(): string },
    input?: {
      options?: FetchOptions;
      variables?: TVariables;
    },
  ): Promise<TResult> => {
    const { authToken, timeout, logger } = { timeout: 10000, ...opts };
    const { variables, options } = input ?? {};
    const stringQuery = query.toString();
    const operationName = getOperationName(stringQuery);
    const __logExecution = logger ? logExecution(logger) : () => {};

    const response = await fetch(url, {
      ...options,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
      },
      body: JSON.stringify({
        query: stringQuery,
        ...(variables && { variables }),
      }),
      signal: AbortSignal.timeout(timeout),
    });

    if (!response.ok) {
      logger?.error("Invalid response.", {
        ...response,
        text: await response.text(),
      });
      throw new GraphQLClientHttpError({ message: response.statusText });
    }

    const elapsedTime = getElapsedTime();
    let responseJson: GraphQLResponse<TResult>;

    try {
      responseJson = (await response.json()) as GraphQLResponse<TResult>;
    } catch (error) {
      logger?.error("Invalid response json.", { error });
      __logExecution({ elapsedTime: elapsedTime(), operationName, variables });

      throw new GraphQLClientInvalidResponseError();
    }

    __logExecution({ elapsedTime: elapsedTime(), operationName, variables });

    const data = responseJson["data"];
    const errors = responseJson["errors"];

    logger?.debug(`${operationName} operation response.`, {
      response: responseJson,
    });
    if (errors) {
      throw new GraphQLClientError({ cause: errors });
    }

    return data as TResult;
  },
});
