import type { Metadata } from "next";

// openGraph/twitter 在子页面是整组覆盖：不显式给图会让详情页社交卡无图
export function textOnlyDetailMetadata(title: string, description: string): Metadata {
  return {
    title,
    description,
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
