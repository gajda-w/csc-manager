import deno from "@deno/vite-plugin";
import { config } from "dotenv";
import process from "node:process";
import { defineConfig } from "vitest/config";

const exclude = [
  "./node_modules/*",
  "./dist/*",
  "./public/*",
  "./src/**/*/generated.ts",
  "./src/**/*/*.d.ts",
  "./src/**/*/types.ts",
];

export default defineConfig({
  plugins: [deno()],
  test: {
    env: {
      ...process.env,
      ...config({ path: ".env.test" }).parsed,
      NODE_ENV: "test",
    },
    coverage: {
      reporter: ["text"],
      provider: "v8",
      exclude,
    },
    exclude,
    include: ["./src/**/*.test.ts"],
    setupFiles: ["./src/lib/test/setup"],
  },
});
