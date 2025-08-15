import { existsSync } from "node:fs";
import { readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import type { Plugin, Rolldown } from "rolldown-vite";

/**
 * Required to run on AWS Lambda.
 */
export const generatePackageJson = (): Plugin => ({
  name: "package-json-generate",
  generateBundle() {
    this.emitFile({
      type: "asset",
      fileName: "package.json",
      source: JSON.stringify({ type: "module" }, null, 2),
    });
  },
});

export const appHandlerEntryFileNames =
  (opts?: { pathPrefix?: string }): Rolldown.ChunkFileNamesFunction =>
  ({ name, facadeModuleId }) => {
    const { pathPrefix } = { pathPrefix: "", ...opts };

    if (!facadeModuleId) {
      throw new Error(`facadeModuleId is undefined for ${name}`);
    }

    const path = facadeModuleId;
    const match = path.match(/\/apps\/([^\/]+)\//);

    if (match) {
      const dirName = match[1];
      return `${pathPrefix}${dirName}-[name].js`;
    }
    return "[name].js";
  };

export const splitChunks = {
  groups: [
    {
      name: "vendor",
      test: /node_modules/,
    },
    {
      name: "lib",
      test: /src\/lib/,
    },
  ],
};

export const getEntryPoints = async (appsDir: string) => {
  const items = await readdir(appsDir);
  const entryPoints: {
    client: string[];
    server: string[];
  } = { client: [], server: [] };

  for (const item of items) {
    const fullPath = join(appsDir, item);
    const stats = await stat(fullPath);

    /**
     * We assume that all apps will follow same structure.
     */
    if (stats.isDirectory()) {
      const serverEntry = join(appsDir, item, "entry-server.ts")
      const clientEntry = join(appsDir, item, "entry-client.tsx")

      entryPoints.server.push(serverEntry);

      if (existsSync(clientEntry)) {
        entryPoints.client.push(clientEntry);
      }
    }
  }

  return entryPoints;
};
