import type { MetadataRoute } from "next";
import { SITE_URL } from "./config";

// ponytail: hand-maintained lastModified. Bump the date when you change a page.
// Build-time `new Date()` claims every page changed on every deploy — a lastmod
// signal crawlers can prove wrong, and therefore discount.
const ROUTES: [path: string, lastModified: string, priority: number][] = [
  ["", "2026-07-31", 1.0],
  ["/prompting", "2026-07-31", 0.9],
  ["/how-it-works", "2026-07-31", 0.8],
  ["/isatvon-vs-costar", "2026-07-31", 0.8],
  ["/privacy", "2026-07-22", 0.3],
  ["/terms", "2026-07-22", 0.3],
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map(([path, lastModified, priority]) => ({
    url: SITE_URL + path,
    lastModified,
    changeFrequency: priority >= 0.8 ? "monthly" : "yearly",
    priority,
  }));
}
