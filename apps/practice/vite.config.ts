import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

const isGitHubPages = process.env.GITHUB_PAGES === "true";

// 练习站的对外地址 = 主站 origin 下的 /practice/（Pages workflow 注入 VITE_KNOWLEDGE_BASE_URL），
// SPA 各查询状态共享同一个 canonical
function emitPracticeUrl(): Plugin {
  return {
    name: "practice-canonical-and-og-url",
    transformIndexHtml(html) {
      const origin = process.env.VITE_KNOWLEDGE_BASE_URL?.trim() || "http://localhost:3000/";
      const practiceUrl = new URL("practice/", origin.endsWith("/") ? origin : `${origin}/`).href;
      const tags = `<meta property="og:url" content="${practiceUrl}" />
    <link rel="canonical" href="${practiceUrl}" />`;
      return html.replace('<meta property="og:type"', `${tags}
    <meta property="og:type"`);
    },
  };
}

export default defineConfig({
  base: isGitHubPages ? "./" : "/",
  plugins: [react(), emitPracticeUrl()],
});
