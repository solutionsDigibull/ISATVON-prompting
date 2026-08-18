import { z } from "zod";

/**
 * Structural invariants for ISATVON content.
 *
 * These check the mechanisms the framework actually promises — a verification step
 * in A, a fallback line in V, the response skeleton embedded in O — rather than
 * character-count floors. Length is not a proxy for quality on prose: a floor fails
 * a valid terse section and passes a verbose empty one.
 */

const nonEmpty = z.string().trim().min(1);

/** The `**I** — …` markers the response contract requires inside O. */
export const RESPONSE_SKELETON_KEYS = ["I", "S", "A", "V", "O", "N"] as const;
export const LITE_SKELETON_KEYS = ["I", "O", "N"] as const;

/** The skeleton is written as `- **I** — …` in every template and example. */
function embedsSkeleton(body: string, keys: readonly string[]): boolean {
  return keys.every((k) => body.includes("**" + k + "** —"));
}

export const promptSchema = z
  .object({
    I: nonEmpty,
    S: nonEmpty,
    A: nonEmpty,
    T: nonEmpty,
    V: nonEmpty,
    O: nonEmpty,
    N: nonEmpty,
  })
  .refine((p) => /verify|verification|check/i.test(p.A), {
    path: ["A"],
    message: "A must end with a self-verification step (no 'verify' instruction found)",
  })
  .refine((p) => /fallback\s*:/i.test(p.V), {
    path: ["V"],
    message: "V must declare a fallback ('Fallback: ...') for unmeetable constraints",
  })
  .refine((p) => embedsSkeleton(p.O, RESPONSE_SKELETON_KEYS), {
    path: ["O"],
    message:
      "O must embed the ISATVON response skeleton (**I** — … **N** —) from references/response-format.md",
  });

export const liteSchema = z
  .object({ I: nonEmpty, O: nonEmpty, N: nonEmpty })
  .refine((p) => embedsSkeleton(p.O, LITE_SKELETON_KEYS), {
    path: ["O"],
    message: "O must embed the compact I / O / N response skeleton",
  });

export const difficultySchema = z.enum(["beginner", "intermediate", "advanced"]);
export const rawQualitySchema = z.enum(["naive", "mediocre", "near-good"]);

export const exampleMetaSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/, "id must be kebab-case"),
  order: z.coerce.number().int().min(0),
  platform: nonEmpty,
  difficulty: difficultySchema,
  category: nonEmpty,
  tags: z.array(nonEmpty).min(1),
  "raw-quality": rawQualitySchema,
  "contributed-by": nonEmpty,
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD"),
  nav: nonEmpty,
  chip: nonEmpty,
  tagline: nonEmpty,
});

export const skillFrontmatterSchema = z.object({
  name: z.string().regex(/^[a-z0-9-]+$/, "skill name must be kebab-case"),
  description: nonEmpty,
  license: nonEmpty,
  metadata: z
    .object({
      version: z
        .string()
        .regex(/^\d+\.\d+\.\d+$/, "version must be semver (major.minor.patch)")
        .optional(),
      compatibility: z.array(nonEmpty).optional(),
    })
    .optional(),
});

export type ExampleMetaInput = z.input<typeof exampleMetaSchema>;
export type SkillFrontmatter = z.infer<typeof skillFrontmatterSchema>;

/** Format a ZodError into one line per problem, prefixed with the file it came from. */
export function formatIssues(error: z.ZodError, source: string): string {
  return error.issues
    .map((i) => `  ${source}: ${i.path.join(".") || "(root)"} — ${i.message}`)
    .join("\n");
}
