import z from "zod";

import { env } from "@/lib/env/env.ts";
import denoJson from "../../../deno.json" with { type: "json" };

const configJson = denoJson as
  & {
    [K in keyof typeof denoJson]: (typeof denoJson)[K];
  }
  & { author: string };

export const baseConfigSchema = z
  .object({
    ENVIRONMENT: z.string().default("dev"),
    IS_BROWSER: z.boolean().default(typeof window !== "undefined"),
    IS_DEVELOPMENT: z.boolean().default(env("NODE_ENV") === "development"),
    IS_TEST: z.boolean().default(env("NODE_ENV") === "test"),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("production"),
    FETCH_TIMEOUT: z
      .number()
      .default(10000)
      .describe("Fetch timeout in milliseconds."),
    AUTHOR: z.string().default(configJson.author),
    NAME: z.string().default(configJson.name),
    VERSION: z.string().default(configJson.version),
    RELEASE: z.string().default(
      `${configJson.name.toLowerCase()}@${configJson.version}`.replaceAll(
        "-",
        " ",
      )
        .toLowerCase(),
    ),
    MANIFEST_ID: z.string().default(
      `${configJson.name.toLowerCase()}.payment`,
    ),
    BASE_PATH: z.string().optional().default(env("BASE_PATH") ?? ""),
  });
