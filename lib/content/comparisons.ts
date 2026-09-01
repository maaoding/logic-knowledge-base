export interface ConceptComparison {
  slug: string;
  left: { label: string; entrySlug: string };
  right: { label: string; entrySlug: string };
  shared: string;
  difference: string;
  watch: string;
}

export const comparisonsIntro =
  "成对出现的概念最容易被当成同义词。每组对照给出共同点、关键差异和最容易混淆的真实场景，两端都链回正文条目。";

export const conceptComparisons: ConceptComparison[] = [
  {
    slug: "deduction-vs-induction",
    left: { label: "演绎", entrySlug: "deduction-and-induction" },
    right: { label: "归纳", entrySlug: "deduction-and-induction" },
    shared: "都由前提支持结论，都可以谈论任何主题，也都可能出错。",
    difference:
      "演绎承诺前提全真时结论必然为真，归纳只承诺让结论更可信、允许反例存在。检验动作是构造例外：找出一个“前提全真而结论为假”的情形，演绎容不下它，归纳容得下。",
    watch:
      "“过去十次准点，今天大概准点”是归纳；换成“按时刻表今天必然准点”就是演绎。主题相同，差别只在承诺的支持强度——先问作者允许不允许例外，再选评价标准。",
  },
  {
    slug: "validity-vs-soundness",
    left: { label: "有效性", entrySlug: "truth-validity-soundness" },
    right: { label: "健全性", entrySlug: "truth-validity-soundness" },
    shared:
      "都是评价演绎论证的标准，都针对前提与结论之间的支持关系；有效且健全的论证，结论必然为真。",
    difference:
      "有效只看形式：排除“前提全真而结论为假”的一切情形；健全还多一条：全部前提事实上为真。区分动作固定两步——先抽形式查有效，再逐条核对前提真假，两步各管一事。",
    watch:
      "“所有鱼会飞；鲤鱼是鱼；所以鲤鱼会飞”形式有效但不健全；“上海在中国；北京在中国；所以广州在中国”前提与结论全真却无效。听人说“这推理没问题”时追问一句：没问题指形式，还是前提也真？",
  },
  {
    slug: "deductive-validity-vs-inductive-strength",
    left: { label: "演绎有效性", entrySlug: "truth-validity-soundness" },
    right: { label: "归纳强度", entrySlug: "inductive-strength" },
    shared: "都是给论证打分的标准，都要求先重构出前提与结论，再评价支持关系本身。",
    difference:
      "有效性是二值的：找到一个“前提真结论假”的反模型就判无效，排除全部情形才算有效；强度是分档的：样本越多越有代表性，结论越可信，但永远给例外留位置。检验动作也不同：演绎抽形式找反模型，归纳查样本规模与代表性。",
    watch:
      "批评“过去十次都准点，所以今天大概准点”时说“这不有效”是打错靶——归纳本来就不承诺有效；该问的是样本够不够、有没有晚点记录。反过来，拿“样本挺大”替“所有天鹅都白”兜底，也挡不住下一只黑天鹅。",
  },
  {
    slug: "modus-ponens-vs-affirming-the-consequent",
    left: { label: "肯定前件", entrySlug: "natural-deduction" },
    right: { label: "肯定后件", entrySlug: "affirming-the-consequent" },
    shared:
      "都从“如果 P 那么 Q”加一个事实出发推结论，日常说出来都顺口，差别全在肯定的是哪一端。",
    difference:
      "肯定前件：P→Q 且 P，推出 Q，有效；肯定后件：P→Q 且 Q，推出 P，无效，因为 Q 可能有别的来路。检验动作是找替代路线：问一句“除了 P 还有什么能让 Q 发生”，找得到，这个推理就是肯定后件。",
    watch:
      "“如果下过雨，地就湿；地湿了；所以下过雨”是肯定后件——洒水车、楼上漏水都能让地湿；“如果下过雨，地就湿；下过雨了；所以地湿”才是肯定前件。两个推理共用同一个条件句，方向一反就翻车。",
  },
  {
    slug: "material-implication-vs-everyday-if",
    left: { label: "实质蕴涵", entrySlug: "material-implication" },
    right: { label: "“如果…就…”", entrySlug: "material-implication" },
    shared:
      "都用前件与后件表达某种条件联系，因此自然语言中的“如果 P，就 Q”常被形式化为 P→Q；是否适合这样翻译，还要看语境承担了哪些额外承诺。",
    difference:
      "实质蕴涵是纯真值函数：前件假或后件真，整句就算真，不管前后件有没有实际联系；日常条件句通常还附带因果、推导或承诺。检验动作：把前件换成明显无关的假话——实质蕴涵照真不误，日常“如果”就不答应。",
    watch:
      "“如果月亮是奶酪做的，那么 2+2=4”按实质蕴涵为真（前件假），但没人会用日常“如果…就…”这样说。读逻辑符号 → 时按真值函数读；读日常文字时别急着翻成 P→Q，先看有没有额外承诺。",
  },
  {
    slug: "sufficient-vs-necessary-condition",
    left: { label: "充分条件", entrySlug: "material-implication" },
    right: { label: "必要条件", entrySlug: "material-implication" },
    shared: "都刻画条件句 P→Q 里的依赖关系，方向不同，读法随之不同。",
    difference:
      "P 是 Q 的充分条件：有 P 就足以出现 Q；P 是 Q 的必要条件：没有 P 就不会有 Q，但有 P 未必够。换算口诀：P→Q 同时告诉你 ¬Q→¬P——同一个条件句，前件是后件的充分条件，后件是前件的必要条件。",
    watch:
      "“年满十八周岁就有选举权”常被当成“满了就够”，其实年满只是必要条件：不满十八一定没有，满了还得先登记。把“有它就够”与“没它不行”说反，谈资格和因果时会整条拧错。",
  },
  {
    slug: "premise-vs-implicit-premise",
    left: { label: "前提", entrySlug: "argument-structure" },
    right: { label: "隐含前提", entrySlug: "argument-structure" },
    shared:
      "都是为结论提供支持的命题，被推翻时论证同样垮掉，也都要经受真实性检查。",
    difference:
      "前提明说出来，读文本就能圈出；隐含前提没说出口，要靠“补上它，明示前提才够得着结论”来定位。检验动作是搭桥：问明示前提与结论之间缺哪条连接原则，补出后让作者本人认账。",
    watch:
      "“这家店排长队，所以一定好吃”明示前提只有排长队，真正撑着结论的是没说出口的“排长队通常说明食物好吃”。反驳它别去数排队人数——先补出隐含前提再动手，靶子立刻清楚。",
  },
  {
    slug: "universal-vs-existential-quantifier",
    left: { label: "全称量词 ∀", entrySlug: "quantifiers" },
    right: { label: "存在量词 ∃", entrySlug: "quantifiers" },
    shared:
      "都回答“有多少对象满足条件”，都在同一个论域上取值，也都由一个反例或一个正例决定命运。",
    difference:
      "∀x Fx 要求论域中没有例外，∃x Fx 只要求至少一个；∀x Fx 等值于 ¬∃x¬Fx。检验动作：推翻全称只需一个反例，推翻存在必须证明一个都没有。",
    watch:
      "“班上有人没交作业”是存在句，报出一个名字就成立，不承诺人数多；“人人都交了”是全称句，得逐个核对。把“有人没交”听成“不少人没交”，就是给 ∃ 偷偷加了一个 ∀。",
  },
  {
    slug: "contradictory-vs-contrary",
    left: { label: "矛盾关系", entrySlug: "categorical-propositions" },
    right: { label: "反对关系", entrySlug: "categorical-propositions" },
    shared: "都是对当方阵上两句话之间的真假制约关系；矛盾关系无条件排除同真，反对关系只有在传统的非空主项假设下才排除同真。",
    difference:
      "现代语义下，矛盾关系（A 与 O、E 与 I）必有一真一假；传统反对关系（A 与 E）在主项非空时不能同真、可以同假。主项为空时 A 与 E 都空真，因此谈反对关系必须先声明存在假设。",
    watch:
      "若确实有人，“所有人都会来”与“所有人都不来”是反对：来一半时两句都错；若讨论对象一个也没有，两句都真。真正与“所有人都会来”无条件矛盾的是“有人不来”。",
  },
  {
    slug: "ambiguity-vs-vagueness",
    left: { label: "歧义", entrySlug: "ambiguity-and-definition" },
    right: { label: "模糊", entrySlug: "ambiguity-and-definition" },
    shared:
      "都让句子在关键处定不下来，都容易在讨论与合同里被钻空子，都是下定义要处理的对象。",
    difference:
      "歧义是一个表达有多个可选的明确含义，选定读法后句子就清楚；模糊是含义单一但边界不明，“高”与“不高”之间没有现成分界线。检验动作是列义项：列得出几个不同读法的是歧义，列不出读法却画不出边界的是模糊。",
    watch:
      "“这份报告不够完整”里，“完整”是模糊——差几页算不完整没有现成答案；而“我看到了报告”若争的是看到全文还是只看到标题，那是歧义。先判断卡壳来自多义还是边界，再决定是改写句子还是约定标准。",
  },
  {
    slug: "contradiction-vs-inconsistency",
    left: { label: "矛盾", entrySlug: "relevant-and-paraconsistent" },
    right: { label: "不一致", entrySlug: "relevant-and-paraconsistent" },
    shared:
      "都涉及 P 与 ¬P 同场出现，在经典逻辑里都会触发爆炸：从矛盾能推出任何结论。",
    difference:
      "矛盾是一对命题之间的关系：同一句话被断定又被否定；不一致是一组命题整体的性质：合在一起推不出矛盾就算一致。检验动作是先定对象：评一句话的冲突看一对，评一套证词、一份档案看全集。",
    watch:
      "证人说“我整晚在家”又说“当晚我在外地出差”，两句话互相矛盾，证词整体因此不一致。追问顺序应该是：先确认这组说法容不容得下矛盾，再谈哪句可信——不一致的档案在经典系统里能“证明”任何事。",
  },
  {
    slug: "box-p-vs-diamond-p",
    left: { label: "□P 必然", entrySlug: "necessity-possibility" },
    right: { label: "◇P 可能", entrySlug: "necessity-possibility" },
    shared:
      "都是模态算子，都相对所选的可能情形范围取值，还能用对偶互相换算：□P 等值于 ¬◇¬P。",
    difference:
      "□P 要求所有可及情形里 P 都真，◇P 只要求至少一个可及情形里 P 真。检验动作是找坏世界：找到一个 P 为假的可及世界，□P 就塌；要让 ◇P 为假，则所有可及世界都得 P 假。",
    watch:
      "“这题可能解出来”只承诺存在一种能解的情形，“这题必然解出来”承诺怎么走都解得出。把“有希望”说成“稳了”，就是把 ◇P 硬升成 □P；论证里遇到模态词，先在两种强度之间标清楚。",
  },
  {
    slug: "de-re-vs-de-dicto",
    left: { label: "de re 从物", entrySlug: "modal-scope" },
    right: { label: "de dicto 从言", entrySlug: "modal-scope" },
    shared:
      "都是同一句含模态词的话的两种读法，形式化后都带 □，分歧只在 □ 罩住什么。",
    difference:
      "de dicto 把必然算子放在量词外，如 □∃xW(x)：每个可能情形都有某位赢家，但人可以变化；de re 把量词放在必然算子外，如 ∃x□W(x)：存在一个特定对象，在每个可能情形都获胜。比较时还要声明论域与跨世界同一性的设定。",
    watch:
      "“无论赛况如何，总会有人获胜”通常是 de dicto，不指定同一个人；“有一位选手无论赛况如何都会获胜”是 de re，锁定同一位选手。把“每个情形各有一个”偷换成“有一个适用于每个情形”，就交换了 □ 与 ∃ 的辖域。",
  },
];
