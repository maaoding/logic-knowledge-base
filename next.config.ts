import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const githubPagesBasePath = process.env.GITHUB_PAGES_BASE_PATH?.trim() ?? "";

if (
  isGitHubPages &&
  githubPagesBasePath &&
  (!githubPagesBasePath.startsWith("/") || githubPagesBasePath.endsWith("/"))
) {
  throw new Error(
    "GITHUB_PAGES_BASE_PATH must be empty or start with one slash without a trailing slash",
  );
}

const nextConfig: NextConfig = {
  ...(isGitHubPages
    ? {
        output: "export" as const,
        ...(githubPagesBasePath
          ? {
              basePath: githubPagesBasePath,
              // Vinext's exporter requests routes without basePath while
              // building. This no-op rewrite reaches the route matcher and is
              // not executed by the exported static artifact.
              rewrites: async () => [
                {
                  source: "/:path*",
                  destination: "/:path*",
                  basePath: false,
                },
              ],
            }
          : {}),
      }
    : {}),
};

export default nextConfig;
