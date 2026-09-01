import type { PracticeQuestion } from "./types";

export const practiceQuestions: PracticeQuestion[] = [
  {
    id: "foundations-1", branchId: "foundations", entrySlug: "argument-structure", kind: "single",
    prompt: "“图书馆今天闭馆，因为门口贴着停电通知。”这句话中主要结论是什么？",
    options: [
      { id: "a", text: "图书馆今天闭馆" },
      { id: "b", text: "门口贴着通知" },
      { id: "c", text: "今天发生了停电" },
      { id: "d", text: "通知由图书馆张贴" },
    ],
    correctOptionIds: ["a"],
    explanation: "“因为”之后给出理由，作者希望接受的判断是图书馆今天闭馆；停电通知是支持它的前提。",
  },
  {
    id: "foundations-2", branchId: "foundations", entrySlug: "truth-validity-soundness", kind: "single",
    prompt: "一个演绎论证形式有效，但至少一个前提为假。可以确定什么？",
    options: [
      { id: "a", text: "结论一定为假" },
      { id: "b", text: "论证不健全" },
      { id: "c", text: "论证形式无效" },
      { id: "d", text: "所有前提都无关" },
    ],
    correctOptionIds: ["b"],
    explanation: "健全性要求形式有效且所有前提真实。假前提不自动破坏有效形式，却足以让论证不健全。",
  },
  {
    id: "foundations-3", branchId: "foundations", entrySlug: "deduction-and-induction", kind: "multiple",
    prompt: "哪些说法正确描述了归纳论证？",
    options: [
      { id: "a", text: "支持强度可以有程度差别" },
      { id: "b", text: "加入新证据可能改变评价" },
      { id: "c", text: "前提为真就保证结论必真" },
      { id: "d", text: "反例与样本偏差可能削弱论证" },
    ],
    correctOptionIds: ["a", "b", "d"],
    explanation: "归纳支持有强弱，也可能被新证据修正。即使前提真实，强归纳论证的结论仍可能为假。",
  },

  {
    id: "traditional-1", branchId: "traditional", entrySlug: "categorical-propositions", kind: "single",
    prompt: "“有些研究者是教师”属于哪一种标准直言命题？",
    options: [
      { id: "a", text: "全称肯定 A" },
      { id: "b", text: "全称否定 E" },
      { id: "c", text: "特称肯定 I" },
      { id: "d", text: "特称否定 O" },
    ],
    correctOptionIds: ["c"],
    explanation: "“有些 S 是 P”既是特称命题又是肯定命题，传统记号为 I。",
  },
  {
    id: "traditional-2", branchId: "traditional", entrySlug: "categorical-syllogism", kind: "single",
    prompt: "在标准直言三段论中，中项具有哪一特征？",
    options: [
      { id: "a", text: "只出现在结论中" },
      { id: "b", text: "出现在两个前提中，但不出现在结论中" },
      { id: "c", text: "必须是结论的主项" },
      { id: "d", text: "必须指现实中存在的对象" },
    ],
    correctOptionIds: ["b"],
    explanation: "中项负责在两个前提间连接大项与小项，因此出现在两个前提中，却不进入结论。",
  },
  {
    id: "traditional-3", branchId: "traditional", entrySlug: "venn-diagram-testing", kind: "multiple",
    prompt: "使用文恩图表示直言命题时，哪些操作正确？",
    options: [
      { id: "a", text: "涂黑一个区域表示该区域为空" },
      { id: "b", text: "用 X 表示至少有一个对象位于该区域" },
      { id: "c", text: "先画结论，再删除不合适的前提" },
      { id: "d", text: "若前提图已经包含结论信息，论证通过检验" },
    ],
    correctOptionIds: ["a", "b", "d"],
    explanation: "文恩图用涂黑表达空集、用 X 表达存在。检验时只把前提画入图中，再看结论是否已经被迫成立。",
  },

  {
    id: "propositional-1", branchId: "propositional", entrySlug: "propositional-language", kind: "single",
    prompt: "公式 ¬P ∨ Q 的主联结词是什么？",
    options: [
      { id: "a", text: "否定 ¬" },
      { id: "b", text: "析取 ∨" },
      { id: "c", text: "条件 →" },
      { id: "d", text: "合取 ∧" },
    ],
    correctOptionIds: ["b"],
    explanation: "¬ 只作用于 P；连接 ¬P 与 Q、决定整个公式最外层结构的是析取词 ∨。",
  },
  {
    id: "propositional-2", branchId: "propositional", entrySlug: "truth-tables", kind: "single",
    prompt: "实质条件句 P→Q 在哪一种真值组合下为假？",
    options: [
      { id: "a", text: "P 真，Q 真" },
      { id: "b", text: "P 真，Q 假" },
      { id: "c", text: "P 假，Q 真" },
      { id: "d", text: "P 假，Q 假" },
    ],
    correctOptionIds: ["b"],
    explanation: "经典真值表把 P→Q 定义为只在前件为真、后件为假时为假。",
  },
  {
    id: "propositional-3", branchId: "propositional", entrySlug: "natural-deduction", kind: "multiple",
    prompt: "哪些是经典命题逻辑中的有效推理步骤？",
    options: [
      { id: "a", text: "由 P∧Q 推出 P" },
      { id: "b", text: "由 P→Q 与 P 推出 Q" },
      { id: "c", text: "由 P→Q 与 Q 推出 P" },
      { id: "d", text: "由 P 和 Q 推出 P∧Q" },
    ],
    correctOptionIds: ["a", "b", "d"],
    explanation: "合取消去、肯定前件和合取引入都是有效规则；由 P→Q 与 Q 倒推 P 是肯定后件。",
  },

  {
    id: "predicate-1", branchId: "predicate", entrySlug: "predicate-language", kind: "single",
    prompt: "在一阶逻辑表达式 Loves(a, x) 中，通常怎样理解 a 与 x？",
    options: [
      { id: "a", text: "a 是名称，x 是变元" },
      { id: "b", text: "a 是量词，x 是联结词" },
      { id: "c", text: "a 是谓词，x 是句子" },
      { id: "d", text: "二者都是二元谓词" },
    ],
    correctOptionIds: ["a"],
    explanation: "名称 a 指定一个对象，变元 x 留出可被量词约束的位置；Loves 是二元谓词。",
  },
  {
    id: "predicate-2", branchId: "predicate", entrySlug: "quantifiers", kind: "single",
    prompt: "“有些学生不阅读”最合适的形式是什么？",
    options: [
      { id: "a", text: "∀x(Sx→¬Rx)" },
      { id: "b", text: "∃x(Sx∧¬Rx)" },
      { id: "c", text: "¬∃x(Sx∧Rx)" },
      { id: "d", text: "∀x(Sx∧¬Rx)" },
    ],
    correctOptionIds: ["b"],
    explanation: "“有些”要求至少存在一个对象，同时满足学生 S 与不阅读 ¬R，因此使用 ∃x(Sx∧¬Rx)。",
  },
  {
    id: "predicate-3", branchId: "predicate", entrySlug: "multiple-quantification", kind: "multiple",
    prompt: "比较 ∀x∃y Loves(x,y) 与 ∃y∀x Loves(x,y)，哪些判断正确？",
    options: [
      { id: "a", text: "前式允许不同的人爱不同对象" },
      { id: "b", text: "后式要求有同一个对象被所有人爱" },
      { id: "c", text: "两式只更换字母，含义相同" },
      { id: "d", text: "后式通常比前式更强" },
    ],
    correctOptionIds: ["a", "b", "d"],
    explanation: "量词顺序决定依赖关系。先存在后全称要求一个共同对象，因此通常蕴涵前式而不反过来。",
  },

  {
    id: "modal-1", branchId: "modal", entrySlug: "necessity-possibility", kind: "single",
    prompt: "◇P 与下面哪个公式等价？",
    options: [
      { id: "a", text: "□¬P" },
      { id: "b", text: "¬□¬P" },
      { id: "c", text: "¬◇P" },
      { id: "d", text: "□P" },
    ],
    correctOptionIds: ["b"],
    explanation: "P 可能为真，等价于 P 不可能为真并非必然，也就是“并非必然非 P”：¬□¬P。",
  },
  {
    id: "modal-2", branchId: "modal", entrySlug: "possible-worlds-semantics", kind: "single",
    prompt: "在标准可能世界语义中，当前世界 w 满足 □P 意味着什么？",
    options: [
      { id: "a", text: "P 只在 w 中为真" },
      { id: "b", text: "P 在至少一个不可及世界为真" },
      { id: "c", text: "P 在 w 可及的每个世界都为真" },
      { id: "d", text: "P 在所有能想象的句子中为真" },
    ],
    correctOptionIds: ["c"],
    explanation: "□ 的真值由可及世界共同决定：从 w 可及的每个世界都必须满足 P。",
  },
  {
    id: "modal-3", branchId: "modal", entrySlug: "modal-scope", kind: "multiple",
    prompt: "哪些做法有助于避免模态推理中的范围混淆？",
    options: [
      { id: "a", text: "明确 □ 或 ◇ 究竟作用于哪一部分" },
      { id: "b", text: "区分“事实上”与“必然地”" },
      { id: "c", text: "把任何真命题都直接必然化" },
      { id: "d", text: "比较 □∀xFx 与 ∀x□Fx 的结构" },
    ],
    correctOptionIds: ["a", "b", "d"],
    explanation: "模态算子的辖域不能忽略；事实真不自动推出必然真，量词与模态词的顺序也可能改变含义。",
  },

  {
    id: "inductive-1", branchId: "inductive", entrySlug: "inductive-strength", kind: "single",
    prompt: "哪项新信息最可能增强“本市居民多数支持该方案”的调查结论？",
    options: [
      { id: "a", text: "样本全部来自方案支持者群聊" },
      { id: "b", text: "随机抽样覆盖不同城区与年龄层" },
      { id: "c", text: "只增加同一小区的受访者" },
      { id: "d", text: "把未回答者都记为支持" },
    ],
    correctOptionIds: ["b"],
    explanation: "覆盖总体关键差异的随机样本更具代表性；来源单一或不当处理未回答者会增加偏差。",
  },
  {
    id: "inductive-2", branchId: "inductive", entrySlug: "analogical-argument", kind: "single",
    prompt: "评价类比论证时，最关键的问题是什么？",
    options: [
      { id: "a", text: "两个对象是否在任何方面都相似" },
      { id: "b", text: "已知相似点是否与待推测性质相关" },
      { id: "c", text: "结论是否使用了较长句子" },
      { id: "d", text: "对象名称是否来自同一语言" },
    ],
    correctOptionIds: ["b"],
    explanation: "相似点的数量不如相关性重要；与目标性质无关的表面相似不能提供可靠支持。",
  },
  {
    id: "inductive-3", branchId: "inductive", entrySlug: "inference-to-best-explanation", kind: "multiple",
    prompt: "比较候选解释时，哪些通常是正当标准？",
    options: [
      { id: "a", text: "能解释更多相关证据" },
      { id: "b", text: "与可靠背景知识相容" },
      { id: "c", text: "提出者声音最大" },
      { id: "d", text: "较少任意附加假设" },
    ],
    correctOptionIds: ["a", "b", "d"],
    explanation: "覆盖力、背景契合与简洁性是常见解释美德；权威姿态或声量本身不会提高解释质量。",
  },

  {
    id: "informal-1", branchId: "informal", entrySlug: "argument-mapping", kind: "single",
    prompt: "两个前提必须合在一起才支持结论，在论证图中应怎样表示？",
    options: [
      { id: "a", text: "作为共同支持的一组相连前提" },
      { id: "b", text: "画成两个互不相关的结论" },
      { id: "c", text: "删除其中较短的前提" },
      { id: "d", text: "把两个前提都标为反驳" },
    ],
    correctOptionIds: ["a"],
    explanation: "共同前提单独都不足以支持结论，必须在图中作为一个联合理由组连接到结论。",
  },
  {
    id: "informal-2", branchId: "informal", entrySlug: "ambiguity-and-definition", kind: "single",
    prompt: "一个论证在前提中把“理论”理解为科学解释，在结论中却理解为随意猜想，主要问题是什么？",
    options: [
      { id: "a", text: "循环论证" },
      { id: "b", text: "偷换含义造成的歧义" },
      { id: "c", text: "诉诸同情" },
      { id: "d", text: "样本过小" },
    ],
    correctOptionIds: ["b"],
    explanation: "同一个关键词在推理过程中改变含义，会让看似连续的论证失去真正的逻辑连接。",
  },
  {
    id: "informal-3", branchId: "informal", entrySlug: "burden-of-proof", kind: "multiple",
    prompt: "在公平分析现实论证时，哪些原则值得采用？",
    options: [
      { id: "a", text: "主张越强，通常需要越充分的证据" },
      { id: "b", text: "先重构对方最合理且有文本依据的版本" },
      { id: "c", text: "对方暂未反驳就等于主张已被证明" },
      { id: "d", text: "区分没有证据与已有反证" },
    ],
    correctOptionIds: ["a", "b", "d"],
    explanation: "举证责任与宽容原则共同要求证据匹配主张，并避免攻击明显弱化的稻草人；沉默不等于证明。",
  },

  {
    id: "mathematical-1", branchId: "mathematical", entrySlug: "proof-and-derivability", kind: "single",
    prompt: "Γ ⊢ φ 中的符号 ⊢ 主要表达什么？",
    options: [
      { id: "a", text: "φ 在现实世界事实上为真" },
      { id: "b", text: "按照给定形式规则可从 Γ 推导 φ" },
      { id: "c", text: "φ 在所有语言中都同义" },
      { id: "d", text: "Γ 与 φ 具有相同长度" },
    ],
    correctOptionIds: ["b"],
    explanation: "⊢ 表示语法层面的可推导关系，即存在符合系统规则的形式证明。",
  },
  {
    id: "mathematical-2", branchId: "mathematical", entrySlug: "soundness-completeness", kind: "single",
    prompt: "一个证明系统的可靠性（soundness）保证什么？",
    options: [
      { id: "a", text: "所有语义有效式都能被证明" },
      { id: "b", text: "凡系统可证明的结论都在相应语义下成立" },
      { id: "c", text: "系统能判定任何数学问题" },
      { id: "d", text: "所有前提都是现实事实" },
    ],
    correctOptionIds: ["b"],
    explanation: "可靠性是从证明到语义的方向：Γ⊢φ 蕴涵 Γ⊨φ；反方向对应完全性。",
  },
  {
    id: "mathematical-3", branchId: "mathematical", entrySlug: "godel-incompleteness", kind: "multiple",
    prompt: "关于第一不完全性定理，哪些表述较准确？",
    options: [
      { id: "a", text: "它针对足够强且有效公理化的算术理论" },
      { id: "b", text: "一致性是结论成立的重要条件" },
      { id: "c", text: "它证明任何一句话都无法被证明" },
      { id: "d", text: "它区分理论中的真与理论内可证" },
    ],
    correctOptionIds: ["a", "b", "d"],
    explanation: "定理有明确适用条件，并不否定所有证明；它揭示足够强的一致形式理论中存在不可判定命题。",
  },

  {
    id: "philosophical-1", branchId: "philosophical", entrySlug: "logical-consequence-pluralism", kind: "single",
    prompt: "逻辑多元主义最核心的主张是什么？",
    options: [
      { id: "a", text: "任何推理都同样正确" },
      { id: "b", text: "可能有不止一种正当的逻辑后承关系" },
      { id: "c", text: "逻辑只研究个人偏好" },
      { id: "d", text: "经典逻辑没有任何用途" },
    ],
    correctOptionIds: ["b"],
    explanation: "多元主义允许不同目标或案例对应多种正当后承关系，但不等于取消评价标准。",
  },
  {
    id: "philosophical-2", branchId: "philosophical", entrySlug: "classical-and-intuitionistic", kind: "single",
    prompt: "直觉主义逻辑为何不普遍接受排中律 P∨¬P？",
    options: [
      { id: "a", text: "因为它拒绝使用任何否定" },
      { id: "b", text: "因为接受析取通常要求能构造其中一边的证明" },
      { id: "c", text: "因为所有命题都被看成假" },
      { id: "d", text: "因为它只允许自然语言" },
    ],
    correctOptionIds: ["b"],
    explanation: "直觉主义把断言与可构造证明紧密联系；若既没有 P 的证明也没有 ¬P 的证明，就不能仅凭形式宣称析取。",
  },
  {
    id: "philosophical-3", branchId: "philosophical", entrySlug: "relevant-and-paraconsistent", kind: "multiple",
    prompt: "哪些说法正确区分了相关逻辑与次协调逻辑的动机？",
    options: [
      { id: "a", text: "相关逻辑要求前提与结论之间具有适当联系" },
      { id: "b", text: "次协调逻辑允许某些矛盾而不推出一切" },
      { id: "c", text: "二者都主张所有矛盾为真" },
      { id: "d", text: "二者都会重新审视经典爆炸原理" },
    ],
    correctOptionIds: ["a", "b", "d"],
    explanation: "两类逻辑关注点不同，却都对“由矛盾可推出任意结论”的经典原则提出限制；它们不等于赞同所有矛盾。",
  },

  {
    id: "history-1", branchId: "history", entrySlug: "mohist-logic", kind: "single",
    prompt: "研究后期墨家论辩时，哪种做法最稳妥？",
    options: [
      { id: "a", text: "直接宣称《墨经》就是现代命题逻辑" },
      { id: "b", text: "结合名实、分类和论辩语境解释其推理观念" },
      { id: "c", text: "只比较现代符号是否完全相同" },
      { id: "d", text: "忽略文本残缺和解释争议" },
    ],
    correctOptionIds: ["b"],
    explanation: "可以比较逻辑问题，但必须保留战国时期的语言、实践背景与文本解释限制，避免简单同一化。",
  },
  {
    id: "history-2", branchId: "history", entrySlug: "nyaya", kind: "single",
    prompt: "正理派五支论式中的“喻”主要承担什么作用？",
    options: [
      { id: "a", text: "给出支持理由与结论联系的例证" },
      { id: "b", text: "取消原来的主张" },
      { id: "c", text: "只标记论证结束" },
      { id: "d", text: "把所有推论变成定义" },
    ],
    correctOptionIds: ["a"],
    explanation: "“喻”援引正反例来展示理由与待证性质之间的普遍联系，使听者理解推论根据。",
  },
  {
    id: "history-3", branchId: "history", entrySlug: "hilbert-godel-metalogic", kind: "multiple",
    prompt: "哪些陈述符合从亚里士多德到现代元逻辑的历史线索？",
    options: [
      { id: "a", text: "亚里士多德系统研究了特定类型的三段论推理" },
      { id: "b", text: "弗雷格的量化语言增强了关系表达能力" },
      { id: "c", text: "希尔伯特纲领推动人们把形式系统本身作为研究对象" },
      { id: "d", text: "哥德尔证明三段论从未有效" },
    ],
    correctOptionIds: ["a", "b", "c"],
    explanation: "三段论、现代量化语言和元数学形成不同阶段；哥德尔的结果讨论形式理论的限制，并不否定三段论有效式。",
  },
];

export function getQuestionsByBranch(branchId: string) {
  return practiceQuestions.filter((question) => question.branchId === branchId);
}
