"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { SearchRecord } from "../lib/catalog";
import { SearchDialog } from "./search-dialog";

const navGroups = [
  { label: "入门", href: "/start" },
  {
    label: "形式逻辑",
    items: [
      ["传统逻辑", "/branches/traditional"],
      ["命题逻辑", "/branches/propositional"],
      ["谓词逻辑", "/branches/predicate"],
      ["模态逻辑", "/branches/modal"],
    ],
  },
  {
    label: "推理与论证",
    items: [
      ["归纳逻辑", "/branches/inductive"],
      ["非形式逻辑", "/branches/informal"],
    ],
  },
  {
    label: "进阶逻辑",
    items: [
      ["数理逻辑", "/branches/mathematical"],
      ["哲学逻辑", "/branches/philosophical"],
    ],
  },
  { label: "逻辑学史", href: "/branches/history" },
  { label: "学习路径", href: "/paths" },
  {
    label: "查阅与应用",
    items: [
      ["术语表", "/glossary"],
      ["易混概念对照", "/comparisons"],
      ["论证分析案例", "/cases"],
      ["学习资源", "/resources"],
    ],
  },
] as const;

export function SiteHeader({ searchEntries, practiceUrl }: { searchEntries: SearchRecord[]; practiceUrl: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const isTyping =
        target?.matches("input, textarea, select") || target?.isContentEditable;
      if (event.key === "/" && !isTyping) {
        event.preventDefault();
        setMenuOpen(false);
        setOpenGroup(null);
        setSearchOpen(true);
      }
      if (event.key === "Escape") {
        setOpenGroup(null);
      }
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target;
      if (target instanceof Node && !headerRef.current?.contains(target)) {
        setOpenGroup(null);
      }
    }

    window.addEventListener("keydown", handleShortcut);
    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      window.removeEventListener("keydown", handleShortcut);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  function toggleTheme() {
    const root = document.documentElement;
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = nextTheme;
    root.style.colorScheme = nextTheme;
    localStorage.setItem("logic-theme", nextTheme);
  }

  function closeMenu() {
    setMenuOpen(false);
    setOpenGroup(null);
  }

  function toggleMenu() {
    if (menuOpen) {
      setOpenGroup(null);
    }
    setMenuOpen((value) => !value);
  }

  function openSearch() {
    setMenuOpen(false);
    setOpenGroup(null);
    setSearchOpen(true);
  }

  function toggleGroup(label: string) {
    setOpenGroup((current) => current === label ? null : label);
  }

  return (
    <>
      <header ref={headerRef} className="site-header">
        <div className="site-header-inner">
          <Link className="site-brand" href="/" onClick={closeMenu} aria-label="逻辑学知识库首页">
            <span className="site-brand-mark" aria-hidden="true">⊢</span>
            <span>
              <strong>逻辑学知识库</strong>
              <small>概念 · 证明 · 论证</small>
            </span>
          </Link>

          <button
            className="mobile-menu-button"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="site-navigation"
            onClick={toggleMenu}
          >
            {menuOpen ? "收起" : "目录"}
          </button>

          <nav
            id="site-navigation"
            className={`site-navigation${menuOpen ? " is-open" : ""}`}
            aria-label="主导航"
          >
            {navGroups.map((group) =>
              "href" in group ? (
                <Link key={group.label} href={group.href} onClick={closeMenu}>
                  {group.label}
                </Link>
              ) : (
                <div className="nav-group" key={group.label}>
                  <button
                    className="nav-group-trigger"
                    type="button"
                    aria-expanded={openGroup === group.label}
                    onClick={() => toggleGroup(group.label)}
                  >
                    {group.label}
                  </button>
                  {openGroup === group.label ? (
                    <div className="nav-group-panel">
                      {group.items.map(([label, href]) => (
                        <Link key={href} href={href} onClick={closeMenu}>
                          {label}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              ),
            )}
            <a className="practice-nav-link" href={practiceUrl} onClick={closeMenu}>练习站</a>
          </nav>

          <div className="site-tools">
            <button className="tool-button" type="button" onClick={openSearch}>
              搜索 <kbd>/</kbd>
            </button>
            <button className="tool-button" type="button" onClick={toggleTheme} aria-label="切换明暗模式">
              明暗
            </button>
          </div>
        </div>
      </header>
      <SearchDialog entries={searchEntries} open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
