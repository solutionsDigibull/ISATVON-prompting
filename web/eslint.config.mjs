import { createRequire } from "node:module";
import tsParser from "@typescript-eslint/parser";
import next from "eslint-config-next";

// eslint-config-next bundles a parser that predates ESLint 10's scope-manager
// contract, and eslint-plugin-react's version sniffing calls the removed
// context.getFilename(). Supplying both outright avoids each code path.
const reactVersion = createRequire(import.meta.url)("react/package.json").version;

/** Flat config. `eslint .` is what CI and the pre-commit hook run. */
const config = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "lib/generated/**", // written by scripts/build-content.ts
      "playwright-report/**",
      "test-results/**",
      "coverage/**",
    ],
  },
  ...next,
  {
    languageOptions: { parser: tsParser },
    settings: { react: { version: reactVersion } },
  },
];

export default config;
