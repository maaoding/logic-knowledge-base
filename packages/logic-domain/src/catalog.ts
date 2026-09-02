import type { Branch, BranchId, EntryKind, EntryManifest } from "./types";

export const branches: Branch[] = [
  { id: "foundations", title: "逻辑基础", group: "起点", symbol: "P ∴ C", eyebrow: "先看清论证", summary: "辨认前提、结论、演绎与归纳，并区分真值、有效性与健全性。", level: "入门", order: 1 },
  { id: "traditional", title: "传统逻辑", group: "形式逻辑", symbol: "S — P", eyebrow: "词项与三段论", summary: "从直言命题、对当关系和词项包含理解经典三段论系统。", level: "入门", order: 2 },
  { id: "propositional", title: "命题逻辑", group: "形式逻辑", symbol: "P → Q", eyebrow: "联结词与真值", summary: "以否定、合取、析取和条件句研究命题之间的真值函数关系。", level: "入门", order: 3 },
  { id: "predicate", title: "谓词逻辑", group: "形式逻辑", symbol: "∀x Fx", eyebrow: "对象、性质与量词", summary: "进入命题内部，表达对象、性质、关系、量词及其辖域。", level: "进阶", order: 4 },
  { id: "modal", title: "模态逻辑", group: "形式逻辑", symbol: "□P ◇P", eyebrow: "必然与可能", summary: "研究必然、可能、可能世界与不同模态范围中的推理。", level: "进阶", order: 5 },
  { id: "inductive", title: "归纳逻辑", group: "推理与论证", symbol: "E ⇢ H", eyebrow: "证据支持假设", summary: "评价样本、类比和解释如何以不同强度支持结论。", level: "入门", order: 6 },
  { id: "informal", title: "非形式逻辑", group: "推理与论证", symbol: "问 · 辨 · 证", eyebrow: "现实语境中的论证", summary: "分析自然语言中的结构、歧义、举证责任和常见推理错误。", level: "入门", order: 7 },
  { id: "mathematical", title: "数理逻辑", group: "进阶逻辑", symbol: "⊢ / ⊨", eyebrow: "系统的元性质", summary: "从证明、模型和不可判定性的角度研究形式系统本身。", level: "专题", order: 8 },
  { id: "philosophical", title: "哲学逻辑", group: "进阶逻辑", symbol: "Γ ⊨ φ", eyebrow: "何谓逻辑后承", summary: "比较经典、直觉主义、相关与次协调逻辑对正确推理的刻画。", level: "专题", order: 9 },
  { id: "history", title: "逻辑学史", group: "多文明逻辑史", symbol: "古 ↔ 今", eyebrow: "多条传统的汇流", summary: "并列观察中国、印度、希腊传统以及现代数理逻辑的形成。", level: "入门", order: 10 },
];

export const entryManifest: EntryManifest[] = [
  { slug: "argument-structure", kind: "concepts", branchId: "foundations", title: "论证结构", aliases: ["前提与结论", "argument"], summary: "论证是一组前提为一个结论提供理由的结构，而不是观点的简单堆叠。", tags: ["前提", "结论", "论证识别"] },
  { slug: "deduction-and-induction", kind: "concepts", branchId: "foundations", title: "演绎与归纳", aliases: ["演绎推理", "归纳推理", "deduction", "induction"], summary: "演绎追求前提对结论的必然保证，归纳则以程度不同的证据支持结论。", tags: ["演绎", "归纳", "推理类型"] },
  { slug: "truth-validity-soundness", kind: "concepts", branchId: "foundations", title: "真值、有效性与健全性", aliases: ["有效论证", "可靠论证", "validity", "soundness"], summary: "真与假评价命题，有效性评价演绎结构，健全性还要求前提真实。", tags: ["真值", "有效性", "健全性"] },

  { slug: "categorical-propositions", kind: "concepts", branchId: "traditional", title: "直言命题与对当关系", aliases: ["A E I O 命题", "square of opposition"], summary: "直言命题按全称或特称、肯定或否定分为四类，并形成传统对当关系。", tags: ["直言命题", "对当方阵", "周延"] },
  { slug: "categorical-syllogism", kind: "systems", branchId: "traditional", title: "直言三段论", aliases: ["三段论", "syllogism"], summary: "用大项、小项和中项连接两个前提，并推出一个直言命题结论。", tags: ["传统逻辑", "词项", "三段论"] },
  { slug: "venn-diagram-testing", kind: "methods", branchId: "traditional", title: "文恩图检验", aliases: ["Venn diagram", "三段论文恩图"], summary: "用区域涂黑和存在标记表示直言命题，以图形检验三段论是否有效。", tags: ["文恩图", "三段论", "有效性检验"] },

  { slug: "propositional-language", kind: "systems", branchId: "propositional", title: "命题联结词与形式语言", aliases: ["命题演算", "propositional language", "TFL"], summary: "用原子命题、真值联结词和括号构造结构明确的命题逻辑公式。", tags: ["联结词", "形式化", "良构公式"] },
  { slug: "truth-tables", kind: "methods", branchId: "propositional", title: "真值表", aliases: ["真值表方法", "truth table"], summary: "穷举原子命题的真值组合，检查复合命题和论证在每种情况下的表现。", tags: ["命题逻辑", "真值", "判定方法"] },
  { slug: "material-implication", kind: "concepts", branchId: "propositional", title: "实质蕴涵", aliases: ["实质条件句", "material implication"], summary: "经典命题逻辑把 P→Q 定义为仅在 P 真而 Q 假时为假。", tags: ["条件句", "蕴涵", "命题逻辑"] },
  { slug: "natural-deduction", kind: "methods", branchId: "propositional", title: "命题逻辑的自然演绎", aliases: ["自然推演", "natural deduction"], summary: "通过联结词的引入与消去规则，把局部推理步骤组织成可检查的形式证明。", tags: ["证明", "推演规则", "命题逻辑"] },

  { slug: "predicate-language", kind: "systems", branchId: "predicate", title: "谓词、名称与变元", aliases: ["一阶逻辑语言", "predicate language", "FOL"], summary: "谓词逻辑用名称指对象、谓词表达性质或关系，并用变元留下可量化的位置。", tags: ["谓词", "名称", "变元"] },
  { slug: "quantifiers", kind: "concepts", branchId: "predicate", title: "全称量词与存在量词", aliases: ["量词", "全称量词", "存在量词", "∀", "∃"], summary: "∀ 表示论域中的每个对象，∃ 表示至少存在一个满足条件的对象。", tags: ["谓词逻辑", "全称", "存在", "∀", "∃"] },
  { slug: "quantifier-scope", kind: "concepts", branchId: "predicate", title: "量词辖域与自由变元", aliases: ["约束变元", "free variable", "scope"], summary: "量词只约束其辖域内相应的变元；没有被约束的出现称为自由变元。", tags: ["辖域", "自由变元", "约束变元"] },
  { slug: "multiple-quantification", kind: "methods", branchId: "predicate", title: "多重量化与关系", aliases: ["量词顺序", "multiple quantification"], summary: "多个量词的顺序决定对象之间的依赖关系，也决定句子的逻辑强弱。", tags: ["多重量化", "关系", "量词顺序"] },

  { slug: "necessity-possibility", kind: "concepts", branchId: "modal", title: "必然与可能", aliases: ["模态词", "necessity", "possibility"], summary: "□P 表示 P 必然为真，◇P 表示 P 可能为真；二者可通过否定互相定义。", tags: ["模态逻辑", "必然", "可能"] },
  { slug: "possible-worlds-semantics", kind: "systems", branchId: "modal", title: "可能世界与可及关系", aliases: ["Kripke semantics", "possible worlds"], summary: "可能世界语义用世界之间的可及关系解释必然和可能的真值条件。", tags: ["可能世界", "可及关系", "Kripke"] },
  { slug: "modal-scope", kind: "concepts", branchId: "modal", title: "模态辖域与常见混淆", aliases: ["模态范围", "de re", "de dicto"], summary: "模态算子的辖域会改变句义；事实为真、必然为真和对象必然具有性质不可混同。", tags: ["模态辖域", "必然化", "范围"] },

  { slug: "inductive-strength", kind: "concepts", branchId: "inductive", title: "归纳强度与归纳健全性", aliases: ["强归纳论证", "cogency"], summary: "归纳论证不保证结论，而是让结论在前提为真时获得较高可信度。", tags: ["归纳", "概率", "证据"] },
  { slug: "enumerative-induction", kind: "methods", branchId: "inductive", title: "枚举归纳", aliases: ["简单枚举", "enumerative induction"], summary: "根据样本中观察到的规律，推测总体或尚未观察个体也具有该性质。", tags: ["样本", "总体", "归纳"] },
  { slug: "analogical-argument", kind: "methods", branchId: "inductive", title: "类比论证", aliases: ["类比推理", "argument by analogy"], summary: "根据两个对象在相关方面的相似，推测它们在另一性质上也可能相似。", tags: ["类比", "相关相似", "反类比"] },
  { slug: "inference-to-best-explanation", kind: "methods", branchId: "inductive", title: "最佳解释推理", aliases: ["溯因推理", "abduction", "IBE"], summary: "在多个候选解释中比较覆盖力、简洁性和背景契合度，暂时接受表现最好的解释。", tags: ["解释", "溯因", "替代假设"] },

  { slug: "argument-mapping", kind: "methods", branchId: "informal", title: "论证图解", aliases: ["论证地图", "argument mapping"], summary: "把理由、反驳和结论画成层级关系，区分共同支持与独立支持。", tags: ["批判性思维", "论证分析", "结构"] },
  { slug: "ambiguity-and-definition", kind: "concepts", branchId: "informal", title: "歧义、定义与语境", aliases: ["语义歧义", "ambiguity", "definition"], summary: "同一词句可能有不同解释；明确语境和定义是判断论证是否成立的前提。", tags: ["歧义", "定义", "语境"] },
  { slug: "burden-of-proof", kind: "concepts", branchId: "informal", title: "举证责任与宽容原则", aliases: ["举证责任", "charity principle", "burden of proof"], summary: "主张者需要提供与主张强度相称的理由，分析者则应先给对方论证以合理的强解释。", tags: ["举证责任", "宽容原则", "对话"] },
  { slug: "affirming-the-consequent", kind: "fallacies", branchId: "informal", title: "肯定后件", aliases: ["肯定结果", "affirming the consequent"], summary: "从“若 P 则 Q”和 Q 推出 P；它忽略了 Q 可能由其他原因造成。", tags: ["形式谬误", "条件句", "反例"] },
  { slug: "straw-man", kind: "fallacies", branchId: "informal", title: "稻草人谬误", aliases: ["歪曲论证", "straw man"], summary: "把对方立场改写成更弱、更极端或更容易攻击的版本，再把击败替身冒充为回应原论证。", tags: ["非形式谬误", "忠实重构", "立场歪曲"] },
  { slug: "ad-hominem", kind: "fallacies", branchId: "informal", title: "诉诸人身", aliases: ["人身攻击", "ad hominem"], summary: "用说话者的身份、品格或处境替代对其理由的评价；来源信息只有在影响证据可信度时才相关。", tags: ["非形式谬误", "相关性", "来源可信度"] },
  { slug: "false-dilemma", kind: "fallacies", branchId: "informal", title: "错误二分法", aliases: ["假两难", "非此即彼", "false dilemma"], summary: "把并未穷尽的少数选项说成全部可能，使读者在被人为压缩的选择中作答。", tags: ["非形式谬误", "选项穷尽", "假两难"] },
  { slug: "causal-misreasoning", kind: "fallacies", branchId: "informal", title: "因果归因误判", aliases: ["错误因果", "相关不等于因果", "false cause"], summary: "仅凭相关或时间先后断定因果，忽略混杂因素、反向因果与共同原因。", tags: ["非形式谬误", "因果推断", "相关性"] },

  { slug: "proof-and-derivability", kind: "concepts", branchId: "mathematical", title: "形式证明与可推导性", aliases: ["形式推导", "derivability", "proof"], summary: "形式证明是在明确公理和规则下构造的有限符号序列，可推导性记录这种语法关系。", tags: ["证明论", "可推导性", "形式系统"] },
  { slug: "soundness-completeness", kind: "concepts", branchId: "mathematical", title: "可靠性与完全性", aliases: ["健全性与完备性", "soundness and completeness"], summary: "可靠性保证可证明的式子在语义上成立；完全性保证语义后承能够被系统证明。", tags: ["证明论", "模型论", "元逻辑"] },
  { slug: "godel-incompleteness", kind: "concepts", branchId: "mathematical", title: "哥德尔不完全性定理", aliases: ["不完备性定理", "Gödel incompleteness"], summary: "足够强、有效公理化且一致的算术理论，不能在自身内部判定所有算术命题。", tags: ["哥德尔", "不完全性", "算术理论"] },

  { slug: "logical-consequence-pluralism", kind: "concepts", branchId: "philosophical", title: "逻辑后承与逻辑多元主义", aliases: ["逻辑多元论", "logical pluralism"], summary: "哲学逻辑追问结论由前提必然推出意味着什么，以及是否只有一种正确刻画。", tags: ["逻辑后承", "经典逻辑", "多元主义"] },
  { slug: "classical-and-intuitionistic", kind: "systems", branchId: "philosophical", title: "经典逻辑与直觉主义逻辑", aliases: ["直觉主义逻辑", "intuitionistic logic"], summary: "直觉主义逻辑把真与构造性证明联系起来，因而不普遍接受经典排中律和双重否定消去。", tags: ["经典逻辑", "直觉主义", "排中律"] },
  { slug: "relevant-and-paraconsistent", kind: "systems", branchId: "philosophical", title: "相关逻辑与次协调逻辑", aliases: ["相干逻辑", "relevance logic", "paraconsistent logic"], summary: "相关逻辑要求前提与结论具有实质联系，次协调逻辑则阻止矛盾推出任意结论。", tags: ["相关逻辑", "次协调逻辑", "爆炸原理"] },

  { slug: "mohist-logic", kind: "history", branchId: "history", title: "墨家与后期墨家论辩", aliases: ["墨辩", "墨经", "Mohist Canons"], summary: "《墨经》及相关篇章讨论名、实、同异、故与推类，保存了中国古代系统论辩的重要材料。", tags: ["中国逻辑史", "墨家", "名实"] },
  { slug: "nyaya", kind: "history", branchId: "history", title: "印度正理派的五支论式", aliases: ["正理派", "Nyāya", "五支作法"], summary: "正理派把推论放在知识来源与论辩程序中考察，经典论式常以五个环节呈现。", tags: ["印度逻辑史", "正理派", "推论"] },
  { slug: "aristotle", kind: "history", branchId: "history", title: "亚里士多德与三段论体系", aliases: ["Aristotle", "工具论"], summary: "亚里士多德首次系统研究哪些三段论形式能让结论必然由前提推出。", tags: ["希腊逻辑史", "三段论", "演绎"] },
  { slug: "frege", kind: "history", branchId: "history", title: "弗雷格与现代逻辑的转折", aliases: ["Gottlob Frege", "概念文字"], summary: "1879 年《概念文字》以函数、论元和量化表达关系推理，成为现代逻辑的重要转折。", tags: ["现代逻辑史", "弗雷格", "量词"] },
  { slug: "hilbert-godel-metalogic", kind: "history", branchId: "history", title: "希尔伯特、哥德尔与元逻辑转向", aliases: ["Hilbert", "Gödel", "元数学"], summary: "希尔伯特纲领把形式系统本身变成研究对象，哥德尔的结果则揭示这种研究的力量与边界。", tags: ["希尔伯特", "哥德尔", "元逻辑"] },
];

const branchById = new Map(branches.map((branch) => [branch.id, branch]));
const entryBySlug = new Map(entryManifest.map((entry) => [entry.slug, entry]));

export function entryPath(entry: Pick<EntryManifest, "kind" | "slug">) {
  return `/${entry.kind}/${entry.slug}`;
}

export function getBranchManifest(id: string) {
  return branchById.get(id as BranchId);
}

export function getEntryManifest(slug: string, kind?: EntryKind) {
  const entry = entryBySlug.get(slug);
  return entry && (!kind || entry.kind === kind) ? entry : undefined;
}

export function getEntryManifestsByBranch(branchId: BranchId) {
  return entryManifest.filter((entry) => entry.branchId === branchId);
}
