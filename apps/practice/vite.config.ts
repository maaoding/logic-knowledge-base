import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const isGitHubPages = process.env.GITHUB_PAGES === "true";

export default defineConfig({
  base: isGitHubPages ? "./" : "/",
  plugins: [react()],
});
