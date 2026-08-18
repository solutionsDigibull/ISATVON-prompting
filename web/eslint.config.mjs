import next from "eslint-config-next";

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
];

export default config;
