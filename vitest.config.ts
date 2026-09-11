import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const root = path.dirname(fileURLToPath(import.meta.url));

// 主站客户端组件测试：不经过 vinext/RSC，仅别名掉 next/link。
// 插件类型来自根 vite 8，与提升版 vitest 自带的 vite 类型实例不同，运行时同源，故显式收窄
export default defineConfig({
  plugins: [react() as never],
  resolve: {
    alias: {
      "next/link": path.resolve(root, "tests/components/next-link-stub.tsx"),
    },
  },
  test: {
    environment: "jsdom",
    include: ["tests/components/**/*.test.tsx"],
  },
});
