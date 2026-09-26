import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { entryPath, getEntry, resolveEntryKind } from "../lib/catalog";
import { textOnlyDetailMetadata } from "../lib/metadata";
import { EntryView } from "./entry-view";

type EntryRouteParams = Promise<{ kind: string; slug: string }>;

export async function getEntryMetadata(params: EntryRouteParams): Promise<Metadata> {
  const { kind: kindParam, slug } = await params;
  const kind = resolveEntryKind(kindParam);
  const entry = kind ? getEntry(slug, kind) : undefined;
  return entry ? textOnlyDetailMetadata(entry.title, entry.summary, entryPath(entry)) : {};
}

export async function EntryRoute({ params }: { params: EntryRouteParams }) {
  const { kind: kindParam, slug } = await params;
  const kind = resolveEntryKind(kindParam);
  const entry = kind ? getEntry(slug, kind) : undefined;
  if (!entry) notFound();
  return <EntryView entry={entry} />;
}
