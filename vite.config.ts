import deno from "@deno/vite-plugin";
import devServer, { defaultOptions } from "@hono/vite-dev-server";
import react from "@vitejs/plugin-react";
import { config } from "dotenv";
import { builtinModules } from "node:module";
import { dirname, join } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { defineConfig } from "rolldown-vite";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

import {
  appHandlerEntryFileNames,
  generatePackageJson,
  getEntryPoints,
  splitChunks,
} from "./etc/scripts/vite.ts";

config();

const ROOT_DIR = dirname(fileURLToPath(import.meta.url));
const HANDLERS_DIR = join(ROOT_DIR, "src", "apps");
const { client: CLIENT_ENTRIES, server: SERVER_ENTRIES } = await getEntryPoints(
  HANDLERS_DIR,
);
const MINIFY = false;
const PORT = Number(process.env.PORT || 8000);
const OUT_DIR = "./dist";
const ASSETS_PATH = "assets/";

const clientConfig = defineConfig({
  plugins: [deno(), react(), cssInjectedByJsPlugin()],
  build: {
    outDir: OUT_DIR,
    emptyOutDir: true,
    minify: MINIFY,
    rollupOptions: {
      input: CLIENT_ENTRIES,
      output: {
        chunkFileNames: `${ASSETS_PATH}[name].js`,
        entryFileNames: appHandlerEntryFileNames({ pathPrefix: ASSETS_PATH }),
        advancedChunks: splitChunks,
      },
    },
  },
});

const serverConfig = defineConfig(({ mode }) => ({
  server: {
    port: PORT,
    allowedHosts: [".ngrok.io", ".ngrok.app"],
  },
  plugins: [
    deno(),
    react(),
    generatePackageJson(),
    {
      ...devServer({
        entry: "./src/dev-server.ts",
        exclude: [...defaultOptions.exclude, `/${ASSETS_PATH}*`, "/public/*"],
      }),
      apply: "serve",
    },
  ],
  ssr: {
    target: "node",
    /**
     * cjs modules problems in dev.
     */
    noExternal: mode !== "development" ? true : undefined,
  },
  build: {
    commonjsOptions: { transformMixedEsModules: true },
    minify: MINIFY,
    outDir: OUT_DIR,
    emptyOutDir: false,
    ssr: true,
    rollupOptions: {
      external: [...builtinModules, /^node:/],
      input: SERVER_ENTRIES,
      output: {
        chunkFileNames: "[name].js",
        advancedChunks: splitChunks,
        entryFileNames: appHandlerEntryFileNames(),
      },
    },
  },
}));

export default defineConfig((opts) => {
  if (opts.mode === "client") {
    return clientConfig;
  }

  return serverConfig(opts);
});
