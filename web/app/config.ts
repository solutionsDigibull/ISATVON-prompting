import type { Metadata } from "next";

// Production serves at www; the apex 308-redirects here. Canonicals, sitemap,
// robots and JSON-LD all derive from this, so it must match what is served.
export const SITE_URL = "https://www.isatvon.ai";

export const GITHUB = "https://github.com/solutionsDigibull/ISATVON-prompting";

export const DIGIBULL_URL = "https://digibull.ai";

export const GOOGLE_SITE_VERIFICATION = "GhypkCeKITnQMVd0wb0aMcDu_EpVet4XOT9vUb5wKR4";

export const GA_MEASUREMENT_ID = "G-XQY3Z4TS70";

/**
 * Page-level metadata. Next replaces the parent `openGraph`/`twitter` objects
 * wholesale instead of merging, so a page that sets its own drops the root's
 * siteName and the app/opengraph-image.tsx image. Building them here keeps
 * og:image, og:url and siteName on every route.
 *
 * A bare `images: ["/opengraph-image"]` string also drops the width/height the
 * file convention emits, and LinkedIn/Slack downgrade to a small card without
 * them — so spell the dimensions out. Keep in sync with app/opengraph-image.tsx.
 */
const OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "ISATVON — a structured prompting framework for reliable AI outputs",
};

export function pageMeta(title: string, description: string, path: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      siteName: "ISATVON",
      type: "website",
      url: path,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE],
    },
  };
}
