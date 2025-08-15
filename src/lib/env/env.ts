import { IS_DENO_RUNTIME, IS_NODE_RUNTIME } from "@/constants.ts";

import process from "node:process";

export function env(): Record<string, string | undefined>;
export function env(name: string): string | undefined;
export function env(
  name?: string,
): string | undefined | Record<string, string | undefined> {
  if (IS_DENO_RUNTIME()) {
    // @ts-expect-error helper if Deno runtime would be used
    return name ? Deno.env.get(name) : Deno.env.toObject();
  }

  if (IS_NODE_RUNTIME()) {
    return name ? process.env[name] : process.env;
  }

  throw new Error("env() is not supported in this runtime.");
}
