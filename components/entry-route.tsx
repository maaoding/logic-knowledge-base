import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEntry, type EntryKind } from "../lib/catalog";
import { textOnlyDetailMetadata } from "../lib/metadata";
import { EntryView } from "./entry-view";

export async function getEntryMetadata(params: Promise<{ slug: string }>, kind: EntryKind): Promise<Metadata> {
  const { slug } = await params;
  const entry = getEntry(slug, kind);
  return entry ? textOnlyDetailMetadata(entry.title, entry.summary) : {};
}

export async function EntryRoute({ params, kind }: { params: Promise<{ slug: string }>; kind: EntryKind }) {
  const { slug } = await params;
  const entry = getEntry(slug, kind);
  if (!entry) notFound();
  return <EntryView entry={entry} />;
}
