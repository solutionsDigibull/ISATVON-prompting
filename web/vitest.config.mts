import { defineConfig } from "vitest/config";
import { resolve } from "node:path";

export default defineConfig({
  resolve: {
    alias: { "@": resolve(import.meta.dirname, ".") },
  },
  test: {
    // forks workers time out starting up on Windows here; threads start fine
    pool: "threads",
    // Node by default; component tests opt in with a `@vitest-environment jsdom` docblock.
    environment: "node",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: ["lib/**/*.ts", "components/**/*.tsx", "app/api/**/*.ts"],
      exclude: ["lib/generated/**"],
    },
  },
});
