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

function bigrams(value: string) {
  const list: string[] = [];
  for (let i = 0; i < value.length - 1; i++) list.push(value.slice(i, i + 2));
  return list.length ? list : [value];
}

export function SearchDialog({
  searchCount,
  open,
  onClose,
}: {
  searchCount: number;
  open: boolean;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const optionRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  // 索引记录不随页面下发：打开搜索后按需加载本地目录
  const [entries, setEntries] = useState<SearchRecord[] | null>(null);

  function closeDialog() {
    setQuery("");
    setActiveIndex(-1);
    onClose();
  }

  useEffect(() => {
    let active = true;
    import("../lib/search-data").then((mod) => {
      if (active) setEntries(mod.searchIndex);
    });
    return () => {
      active = false;
    };
  }, []);

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
    if (!normalizedQuery || !entries) return [];

    return entries
      .filter((entry) =>
        normalize(
          [entry.title, ...entry.aliases, entry.summary, ...entry.tags, entry.branch].join(" "),
        ).includes(normalizedQuery),
      )
      .map((entry) => {
        // 标题命中排最前，其次别名，再次标签/栏目，最后摘要；同级保持目录顺序
        const score = normalize(entry.title).includes(normalizedQuery)
          ? 4
          : normalize(entry.aliases.join(" ")).includes(normalizedQuery)
            ? 3
            : normalize([...entry.tags, entry.branch].join(" ")).includes(normalizedQuery)
              ? 2
              : 1;
        return { entry, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map((item) => item.entry);
  }, [entries, query]);

  // 无直接结果时按字符对重叠度推荐相近内容，避免死胡同
  const suggestions = useMemo(() => {
    if (!entries || !query || results.length) return [];
    const nq = normalize(query);
    const grams = bigrams(nq);
    const searchable = (entry: SearchRecord) =>
      normalize([entry.title, ...entry.aliases, entry.summary, ...entry.tags, entry.branch].join(" "));
    return entries
      .map((entry) => {
        const text = searchable(entry);
        const score = grams.reduce((total, gram) => total + (text.includes(gram) ? 1 : 0), 0);
        return { entry, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((item) => item.entry);
  }, [entries, query, results.length]);

  // 高亮项变化时保持可见；键盘在结果间移动，Enter 走链接的客户端导航
  useEffect(() => {
    optionRefs.current[activeIndex]?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  function moveActive(delta: 1 | -1) {
    if (!results.length) return;
    setActiveIndex((current) => {
      if (current < 0) return delta === 1 ? 0 : results.length - 1;
      const next = current + delta;
      return next < 0 ? results.length - 1 : next >= results.length ? 0 : next;
    });
  }

  function handleInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveActive(1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      moveActive(-1);
    } else if (event.key === "Enter" && activeIndex >= 0 && results[activeIndex]) {
      event.preventDefault();
      optionRefs.current[activeIndex]?.click();
    }
  }

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
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(-1);
            }}
            onKeyDown={handleInputKeyDown}
            placeholder="试试“有效性”“∀”或“墨家”"
            autoComplete="off"
            role="combobox"
            aria-expanded="true"
            aria-controls="search-results-listbox"
            aria-autocomplete="list"
            aria-activedescendant={activeIndex >= 0 ? `search-option-${activeIndex}` : undefined}
          />
          <kbd>Esc</kbd>
        </label>

        <p className="sr-only" role="status" aria-live="polite">
          {query ? (results.length ? `找到 ${results.length} 项结果` : "没有找到匹配结果") : ""}
        </p>

        <div className="search-results">
          {!query ? (
            <p className="search-empty">
              搜索覆盖 {searchCount} 项本地内容，包括知识条目、术语、对照、案例与资源；输入内容不会上传。
            </p>
          ) : results.length ? (
            <ul id="search-results-listbox" role="listbox" aria-label="搜索结果">
              {results.map((entry, index) => (
                <li key={entry.slug} role="presentation">
                  <Link
                    href={entry.path}
                    ref={(node) => {
                      optionRefs.current[index] = node;
                    }}
                    id={`search-option-${index}`}
                    role="option"
                    aria-selected={index === activeIndex}
                    onClick={closeDialog}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={index === activeIndex ? "is-active" : undefined}
                  >
                    <span className="search-result-meta">
                      {entry.branch} · {kindLabels[entry.kind]}
                    </span>
                    <strong>{entry.title}</strong>
                    <span>{entry.summary}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : entries ? (
            <>
              <p className="search-empty">没有找到匹配条目。可尝试标题、别名、符号或分支名称。</p>
              {suggestions.length ? (
                <div className="search-suggestions">
                  <p>是否在找：</p>
                  <ul>
                    {suggestions.map((entry) => (
                      <li key={entry.slug}>
                        <Link href={entry.path} onClick={closeDialog}>
                          <span className="search-result-meta">
                            {entry.branch} · {kindLabels[entry.kind]}
                          </span>
                          <strong>{entry.title}</strong>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </>
          ) : (
            <p className="search-empty">正在加载本地目录…</p>
          )}
        </div>
      </div>
    </dialog>
  );
}
