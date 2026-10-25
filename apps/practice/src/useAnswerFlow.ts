import { useState } from "react";

// 两套会话共享的“选择-提交”状态机：提交后锁定选项，推进或重开时重置
export function useAnswerFlow(onSubmit: (selectedIds: string[]) => void) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  function changeSelection(kind: "single" | "multiple", optionId: string, checked: boolean) {
    if (submitted) return;
    if (kind === "single") {
      setSelectedIds(checked ? [optionId] : []);
      return;
    }
    setSelectedIds((current) => (checked ? [...current, optionId] : current.filter((id) => id !== optionId)));
  }

  function submit() {
    if (submitted || selectedIds.length === 0) return;
    onSubmit(selectedIds);
    setSubmitted(true);
  }

  function resetSelection() {
    setSelectedIds([]);
    setSubmitted(false);
  }

  return { selectedIds, submitted, changeSelection, submit, resetSelection };
}
