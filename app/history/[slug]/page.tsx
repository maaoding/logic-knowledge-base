import type { Metadata } from "next";
import { EntryRoute, getEntryMetadata } from "../../../components/entry-route";
import { getEntriesByKind } from "../../../lib/catalog";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return getEntriesByKind("history").map(({ slug }) => ({ slug })); }
export function generateMetadata({ params }: Props): Promise<Metadata> { return getEntryMetadata(params, "history"); }
export default function Page({ params }: Props) { return <EntryRoute params={params} kind="history" />; }
