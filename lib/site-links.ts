import type { BranchId } from "@logic/domain";

const practiceSiteOrigin = process.env.NEXT_PUBLIC_PRACTICE_SITE_URL ?? "http://localhost:3001/";

export function practiceSiteUrl(branchId?: BranchId) {
  const url = new URL(practiceSiteOrigin);
  if (branchId) url.searchParams.set("branch", branchId);
  return url.href;
}
