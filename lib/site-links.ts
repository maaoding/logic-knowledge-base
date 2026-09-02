import type { BranchId } from "@logic/domain";

const defaultSiteOrigin = "http://localhost:3000/";
const practiceSiteOrigin = process.env.NEXT_PUBLIC_PRACTICE_SITE_URL ?? "http://localhost:3001/";

function siteBaseUrl() {
  const url = new URL(process.env.NEXT_PUBLIC_SITE_URL?.trim() || defaultSiteOrigin);
  url.search = "";
  url.hash = "";
  url.pathname = `${url.pathname.replace(/\/+$/, "")}/`;

  const pagesBasePath = process.env.GITHUB_PAGES_BASE_PATH?.trim().replace(/^\/+|\/+$/g, "");
  if (pagesBasePath && !url.pathname.endsWith(`/${pagesBasePath}/`)) {
    url.pathname = `${url.pathname}${pagesBasePath}/`;
  }

  return url;
}

export function siteUrl(pathname = "/") {
  return new URL(pathname.replace(/^\/+/, ""), siteBaseUrl());
}

export function practiceSiteUrl(branchId?: BranchId) {
  const url = new URL(practiceSiteOrigin);
  if (branchId) url.searchParams.set("branch", branchId);
  return url.href;
}
