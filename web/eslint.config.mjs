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
  {
    // react/display-name crashes under ESLint 10's flat-config API
    // (eslint-plugin-react calls context.getFilename(), removed in v10).
    rules: { "react/display-name": "off" },
  },
];

export default config;
