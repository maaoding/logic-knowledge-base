import { branches } from "@logic/domain";
import { useEffect, useState } from "react";
import { Landing } from "./Landing";
import { PracticeSession } from "./PracticeSession";
import { ReviewSession } from "./ReviewSession";
import { SiteHeader, type Theme } from "./SiteHeader";
import { absoluteKnowledgeUrl } from "./knowledge-links";
import { isStorageAvailable, PROGRESS_KEY } from "./progress";

export function App() {
  const [theme, setTheme] = useState<Theme>(() => document.documentElement.dataset.theme === "dark" ? "dark" : "light");
  // 跨标签页同步：storage 事件只由其他标签页的写入触发，据此重挂当前视图以重读进度
  const [progressVersion, setProgressVersion] = useState(0);
  const searchParams = new URLSearchParams(window.location.search);
  const branchParameter = searchParams.get("branch");
  const reviewParameter = searchParams.get("review");
  const branch = branches.find((candidate) => candidate.id === branchParameter);

  function toggleTheme() {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    try {
      // 与主站共用 logic-theme：同一域名下两站主题保持同步
      localStorage.setItem("logic-theme", nextTheme);
    } catch {
      // 存储被禁时仅放弃持久化，本次会话内仍可切换
    }
  }

  // 浏览器历史里区分分支与复习视图，不再一排同名标签
  useEffect(() => {
    document.title = reviewParameter === "wrong"
      ? "错题复习｜逻辑学分支练习"
      : branch
        ? `${branch.title}｜逻辑学分支练习`
        : "逻辑学分支练习";
  }, [branch, reviewParameter]);

  useEffect(() => {
    function handleStorageChange(event: StorageEvent) {
      // key 为 null 对应 localStorage.clear()
      if (event.key === null || event.key === PROGRESS_KEY) {
        setProgressVersion((version) => version + 1);
      }
    }
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <>
      <a className="skip-link" href="#main-content">跳到正文</a>
      <SiteHeader theme={theme} onToggle={toggleTheme} />
      {!isStorageAvailable() ? (
        <div className="storage-warning" role="note">
          <div className="practice-shell">
            当前浏览器限制了本地存储，答题进度与主题偏好不会被保存，刷新后将回到未作答状态；本次会话内仍可正常答题与查看解析。
          </div>
        </div>
      ) : null}
      {reviewParameter === "wrong" ? (
        <ReviewSession key={`review-${progressVersion}`} />
      ) : branch ? (
        <PracticeSession key={`${branch.id}-${progressVersion}`} branch={branch} />
      ) : (
        <Landing key={`landing-${progressVersion}`} invalidBranch={branchParameter ?? undefined} />
      )}
      <footer className="practice-footer">
        <div className="practice-shell"><p>答题进度仅保存在此浏览器本地，不会上传或收集；点“重新练习本分支”或清除浏览器数据即可删除。</p><a href={absoluteKnowledgeUrl()}>逻辑学知识库</a></div>
      </footer>
    </>
  );
}
