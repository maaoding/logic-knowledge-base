import type { Metadata } from "next";
import { EntryRoute, getEntryMetadata } from "../../../components/entry-route";
import { entryKinds, getEntriesByKind } from "../../../lib/catalog";

type Props = { params: Promise<{ kind: string; slug: string }> };

// 五类条目共用一条详情路由；/branches、/paths 等两段静态路由优先于本路由
export function generateStaticParams() {
  return entryKinds.flatMap((kind) => getEntriesByKind(kind).map(({ slug }) => ({ kind, slug })));
}

export function generateMetadata({ params }: Props): Promise<Metadata> {
  return getEntryMetadata(params);
}

export default function Page({ params }: Props) {
  return <EntryRoute params={params} />;
}
