import type { Metadata } from "next";
import "katex/dist/katex.min.css";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";
import { searchIndex } from "../lib/catalog";
import { practiceSiteUrl } from "../lib/site-links";
import "./globals.css";

const siteDescription =
  "从论证、形式系统到多文明逻辑史，为零基础读者建立可搜索、可练习的逻辑学知识网络。";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000/"),
  title: {
    default: "逻辑学知识库",
    template: "%s｜逻辑学知识库",
  },
  description: siteDescription,
  openGraph: {
    type: "website",
    locale: "zh_CN",
    title: "逻辑学知识库",
    description: siteDescription,
    images: [{ url: "/og.png", alt: "逻辑学知识库：概念、证明、论证" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "逻辑学知识库",
    description: siteDescription,
    images: ["/og.png"],
  },
};

const themeScript = `
(() => {
  try {
    const saved = localStorage.getItem("logic-theme");
    const theme = saved === "light" || saved === "dark"
      ? saved
      : (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  } catch (_) {}
})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a className="skip-link" href="#main-content">
          跳到正文
        </a>
        <SiteHeader searchEntries={searchIndex} practiceUrl={practiceSiteUrl()} />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
