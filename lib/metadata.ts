import type { Metadata } from "next";

// openGraph/twitter 在子页面是整组覆盖：不显式给图会让详情页社交卡无图
// canonical 取本页路径，避免多入口（分页、查询串、练习站来源）被当作重复内容
export function textOnlyDetailMetadata(title: string, description: string, canonicalPath: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      title,
      description,
      images: [{ url: "/og.png", alt: "逻辑学知识库：概念、证明、论证" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og.png"],
    },
  };
}
