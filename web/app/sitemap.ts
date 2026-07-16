import type { MetadataRoute } from "next";
import { SITE_URL } from "./config";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ["", "/prompting", "/how-it-works", "/isatvon-vs-costar", "/privacy", "/terms"].map(
    (path) => ({ url: SITE_URL + path, lastModified, priority: path === "" ? 1.0 : 0.7 })
  );
}
