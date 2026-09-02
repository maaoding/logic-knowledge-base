import type { MetadataRoute } from "next";
import {
  branches,
  entryPath,
  knowledgeEntries,
  learningPaths,
  referenceSections,
} from "../lib/catalog";
import { practiceSiteUrl, siteUrl } from "../lib/site-links";

export default function sitemap(): MetadataRoute.Sitemap {
  const sitePaths = [
    "/",
    "/start",
    "/paths",
    ...referenceSections.map((section) => section.href),
    ...branches.map((branch) => `/branches/${branch.id}`),
    ...knowledgeEntries.map((entry) => entryPath(entry)),
    ...learningPaths.map((path) => `/paths/${path.slug}`),
  ];
  const urls = new Set(sitePaths.map((path) => siteUrl(path).href));
  urls.add(practiceSiteUrl());

  return [...urls].map((url) => ({ url }));
}
