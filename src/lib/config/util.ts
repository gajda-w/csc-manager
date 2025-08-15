import type { z, ZodSafeParseSuccess } from "zod";

import { env } from "@/lib/env/env.ts";
import type { AnyZodSchema } from "@/lib/zod/types.ts";

export const prepareConfig = <Schema extends AnyZodSchema = AnyZodSchema>({
  name = "",
  schema,
  input,
  serverOnly = false,
}: {
  input?: Partial<{ [Key in keyof z.infer<Schema>]: unknown }>;
  name?: string;
  schema: Schema;
  serverOnly?: boolean;
}): ZodSafeParseSuccess<Schema["_output"]>["data"] => {
  const parsedConfig = schema.safeParse({
    ...env(),
    ...(input ?? {}),
  });

  if (serverOnly && typeof window !== "undefined") {
    return {} as ZodSafeParseSuccess<Schema["_output"]>["data"];
  }

  if (!parsedConfig.success) {
    const errors = parsedConfig.error.issues.map(
      (issue) => `${issue.path}: ${issue.message}`,
    );

    throw new Error(
      `Invalid ${name ? name + " " : ""}CONFIG\n\n${errors.join("\n")}`,
    );
  }

  return parsedConfig.data;
};
