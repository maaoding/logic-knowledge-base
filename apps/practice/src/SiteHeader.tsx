import { absoluteKnowledgeUrl } from "./knowledge-links";

export type Theme = "light" | "dark";

function ThemeButton({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  return (
    <button className="theme-button" type="button" onClick={onToggle} aria-label={`切换为${theme === "light" ? "深色" : "浅色"}主题`}>
      <span aria-hidden="true">{theme === "light" ? "◐" : "◑"}</span>
      {theme === "light" ? "深色" : "浅色"}
    </button>
  );
}

export function SiteHeader({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  return (
    <header className="practice-header">
      <div className="practice-shell header-inner">
        <a className="practice-brand" href="./">
          <strong>逻辑学分支练习</strong>
          <small>按分支练习 · 即时解析</small>
        </a>
        <nav aria-label="站点操作">
          <a href={absoluteKnowledgeUrl()}>返回逻辑学知识库</a>
          <ThemeButton theme={theme} onToggle={onToggle} />
        </nav>
      </div>
    </header>
  );
}
