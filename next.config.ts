import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  ...(isGitHubPages
    ? {
        output: "export" as const,
        basePath: "/logic-knowledge-base",
        // Vinext's exporter requests routes without basePath while building.
        // This build-only no-op rewrite lets those requests reach the route
        // matcher; the static Pages artifact does not execute rewrites.
        rewrites: async () => [
          {
            source: "/:path*",
            destination: "/:path*",
            basePath: false,
          },
        ],
      }
    : {}),
};

export default nextConfig;
