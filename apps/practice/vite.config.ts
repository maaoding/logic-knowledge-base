import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

const isGitHubPages = process.env.GITHUB_PAGES === "true";

// 练习站的对外地址 = 主站 origin 下的 /practice/（Pages workflow 注入 VITE_KNOWLEDGE_BASE_URL），
// SPA 各查询状态共享同一个 canonical；社交卡片复用主站同源的 og.png
function emitPracticeUrl(): Plugin {
  return {
    name: "practice-canonical-and-og-url",
    transformIndexHtml(html) {
      const origin = process.env.VITE_KNOWLEDGE_BASE_URL?.trim() || "http://localhost:3000/";
      const base = origin.endsWith("/") ? origin : `${origin}/`;
      const practiceUrl = new URL("practice/", base).href;
      const ogImageUrl = new URL("og.png", base).href;
      const tags = `<meta property="og:url" content="${practiceUrl}" />
    <meta property="og:image" content="${ogImageUrl}" />
    <meta property="og:image:alt" content="逻辑学知识库：概念、证明、论证" />
    <meta name="twitter:image" content="${ogImageUrl}" />
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
