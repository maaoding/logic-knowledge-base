"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { SearchRecord } from "../lib/catalog";

const kindLabels: Record<SearchRecord["kind"], string> = {
  concepts: "概念",
  systems: "形式系统",
  methods: "方法",
  fallacies: "谬误",
  history: "历史",
  glossary: "术语",
  comparison: "概念对照",
  case: "案例",
  resource: "资源",
};

function normalize(value: string) {
  return value.normalize("NFKC").toLocaleLowerCase("zh-CN").replace(/\s+/g, "");
}

export function SearchDialog({
  entries,
  open,
  onClose,
}: {
  entries: SearchRecord[];
  open: boolean;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");

  function closeDialog() {
    setQuery("");
    onClose();
  }

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
      window.requestAnimationFrame(() => inputRef.current?.focus());
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  const results = useMemo(() => {
    const normalizedQuery = normalize(query);
    if (!normalizedQuery) return [];

    return entries
      .filter((entry) =>
        normalize(
          [entry.title, ...entry.aliases, entry.summary, ...entry.tags, entry.branch].join(" "),
        ).includes(normalizedQuery),
      )
      .slice(0, 10);
  }, [entries, query]);

  return (
    <dialog
      ref={dialogRef}
      className="search-dialog"
      aria-labelledby="search-title"
      onCancel={(event) => {
        event.preventDefault();
        closeDialog();
      }}
      onClose={onClose}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          event.stopPropagation();
          closeDialog();
        }
      }}
    >
      <div className="search-panel">
        <div className="search-heading">
          <div>
            <p className="eyebrow">本地目录</p>
            <h2 id="search-title">搜索逻辑学知识</h2>
          </div>
          <button className="icon-button" type="button" onClick={closeDialog} aria-label="关闭搜索">
            关闭
          </button>
        </div>

        <label className="search-field">
          <span className="sr-only">输入标题、术语、别名、标签、案例或资源关键词</span>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="试试“有效性”“∀”或“墨家”"
            autoComplete="off"
          />
          <kbd>Esc</kbd>
        </label>

        <p className="sr-only" role="status" aria-live="polite">
          {query ? (results.length ? `找到 ${results.length} 项结果` : "没有找到匹配结果") : ""}
        </p>

        <div className="search-results">
          {!query ? (
            <p className="search-empty">
              搜索覆盖 {entries.length} 项本地内容，包括知识条目、术语、对照、案例与资源；输入内容不会上传。
            </p>
          ) : results.length ? (
            <ul>
              {results.map((entry) => (
                <li key={entry.slug}>
                  <Link href={entry.path} onClick={closeDialog}>
                    <span className="search-result-meta">
                      {entry.branch} · {kindLabels[entry.kind]}
                    </span>
                    <strong>{entry.title}</strong>
                    <span>{entry.summary}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="search-empty">没有找到匹配条目。可尝试标题、别名、符号或分支名称。</p>
          )}
        </div>
      </div>
    </dialog>
  );
}
