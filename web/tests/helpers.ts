import { resolve } from "node:path";

/** Repo root — the tests validate the canonical markdown that lives above `web/`. */
export const ROOT = resolve(import.meta.dirname, "../..");
