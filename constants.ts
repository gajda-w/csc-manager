import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

/**
 * This file should lay in project root dir to properly resolve paths in dev & production mode.
 */

export const ASSETS_PATH = "/assets";

export const MODE = import.meta.env.MODE;

export const IS_PROD = MODE !== "development";

export const IS_DEV = !IS_PROD;

export const IS_SSR = () => typeof window === "undefined";

export const IS_BROWSER = () => !IS_SSR;

// @ts-expect-error helper if Deno runtime would be used
export const IS_DENO_RUNTIME = () => typeof Deno !== "undefined";

export const IS_NODE_RUNTIME = () => typeof process !== "undefined";

export const ROOT_DIR = path.dirname(fileURLToPath(import.meta.url));
/**
 * In production vite copies files from public to outDir dir root.
 */
export const PUBLIC_DIR = IS_PROD ? ROOT_DIR : path.join(ROOT_DIR, "public");

export const LOGGING_REDACT_KEYS = [
  /^pw$/,
  /^password$/i,
  /^phone/i,
  /^secret/i,
  /email/i,
  /userEmail/i,
];
