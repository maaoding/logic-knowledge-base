export interface GlossaryTerm {
  term: string;
  aliases?: string[];
  definition: string;
  confusion?: string;
  seeAlso: string[];
}

export function glossaryTermId(term: Pick<GlossaryTerm, "term">) {
  return `term-${term.term.normalize("NFKC").replace(/\s+/g, "-")}`;
}

export const glossaryIntro =
  "按拼音顺序排列的逻辑学常用术语速查。每条给出够用的定义并链回正文条目，容易混淆的术语另附提示；需要完整讲解时请点开对应条目。";

export const glossaryTerms: GlossaryTerm[] = [
  {
    term: "必然",
    aliases: ["necessity"],
    definition:
      "□P 表示 P 在所有相关的可能情形中都成立，与“事实上成立”不在同一层级。必然总是相对于某个范围而言：逻辑必然、物理必然、规则必然各有各的可能情形范围。",
    confusion:
      "别把“非常确定”或“事实上为真”当成必然：从 P 真推不出 □P，这一步叫不当必然化。说“必然”之前，先说清相对哪个范围而言。",
    seeAlso: ["necessity-possibility", "possible-worlds-semantics", "modal-scope"],
  },
  {
    term: "重言式",
    aliases: ["tautology", "永真式"],
    definition:
      "在所有赋值下都为真的公式，如 P∨¬P；真值表最后一列全真是它的标志。重言式为真靠形式，不靠内容。",
    confusion:
      "“所有单身汉都未婚”内容上必然，但在命题逻辑里只是原子命题的组合，按形式分类算偶真式——重言式的“必然”是形式层面的。也别把重言式当成有信息量的话：P∨¬P 说了等于没说。",
    seeAlso: ["truth-tables", "propositional-language"],
  },
  {
    term: "存在量词",
    aliases: ["existential quantifier", "∃"],
    definition:
      "∃x Fx 断言论域中至少有一个对象满足 F；举出一个对象就足以让它为真。它等值于 ¬∀x¬Fx，即“并非全都没有”。",
    confusion:
      "日常说“有些学生及格了”常暗示“还有些没及格”，逻辑的 ∃ 只承诺至少一个，不排除全部及格。检验方向也要分清：一个反例推翻全称句，推翻存在句却要证明一个都没有。",
    seeAlso: ["quantifiers", "quantifier-scope", "multiple-quantification"],
  },
  {
    term: "大项",
    aliases: ["major term"],
    definition:
      "直言三段论中充当结论谓项的词项，出现在大前提里。大项、小项是结论的两端，三段论按它们的位置组成四个格。",
    seeAlso: ["categorical-syllogism", "categorical-propositions"],
  },
  {
    term: "等值",
    aliases: ["equivalence", "logical equivalence", "逻辑等价"],
    definition:
      "两个公式在所有赋值下同真同假，记作 ≡ 或 ⇔，例如 P→Q 与 ¬P∨Q 等值。等值的双方可以互相替换而不改变真值。",
    confusion:
      "P↔Q 只是一个复合公式，可以碰巧为真；说“P 与 Q 等值”更强，要求在每种赋值下都同值。检验办法是画真值表，看两列是否处处相同。",
    seeAlso: ["truth-tables", "propositional-language", "material-implication"],
  },
  {
    term: "对当关系",
    aliases: ["square of opposition", "对当方阵"],
    definition:
      "A、E、I、O 四种直言命题之间的真假制约关系。现代一阶语义下，无条件保留的是矛盾关系：A 与 O、E 与 I 必一真一假；传统方阵在主项类非空的前提下，另有反对、下反对与由全称到特称的差等关系。",
    confusion:
      "最容易把传统关系当成无条件规律。“所有 S 是 P”与“没有 S 是 P”在 S 非空时不能同真；若 S 为空，两句都会空真。真正与“所有 S 是 P”在现代语义下始终矛盾的是“有些 S 不是 P”。",
    seeAlso: ["categorical-propositions", "categorical-syllogism"],
  },
  {
    term: "反驳",
    aliases: ["refutation"],
    definition:
      "针对论证本身给出理由说明它站不住：或指出某个前提为假，或证明形式无效，或举出与结论冲突的更强证据。反驳的对象是支持关系，不只是结论。",
    seeAlso: ["argument-structure", "truth-validity-soundness", "burden-of-proof"],
  },
  {
    term: "反例",
    aliases: ["counterexample"],
    definition:
      "推翻全称概括的个别对象，或使“前提全真而结论为假”的具体代入例；找到一个就足以否定相应的概括或论证形式。",
    confusion:
      "反例必须保持前提为真：单说“结论错了”不算给出反例。“天鹅都是白的”的反例是一只真实存在的黑天鹅；一个推理形式的反例是同形式下前提全真、结论为假的例子。",
    seeAlso: ["truth-validity-soundness", "enumerative-induction"],
  },
  {
    term: "否定后件",
    aliases: ["modus tollens"],
    definition:
      "有效推理形式：P→Q 且 ¬Q，推出 ¬P。后件落空，前件就站不住，它与肯定前件并称两条基本的有效路线。",
    seeAlso: ["natural-deduction", "affirming-the-consequent"],
  },
  {
    term: "否定前件",
    aliases: ["denying the antecedent"],
    definition:
      "无效推理形式：从 P→Q 与 ¬P 推出 ¬Q。前件不成立时，后件仍可能经由其他途径成立。",
    confusion:
      "与否定后件一字之差：否定的是后件 Q 则有效，否定的是前件 P 则无效。“如果下雨地就湿；没下雨；所以地不湿”错在忽略洒水车——地湿未必靠下雨。",
    seeAlso: ["affirming-the-consequent", "natural-deduction"],
  },
  {
    term: "赋值",
    aliases: ["valuation", "assignment"],
    definition:
      "给命题变元逐一指派真或假的做法；复合公式的真值由各变元的赋值按联结词规则算出。真值表就是穷举全部赋值并逐一求值的表格。",
    seeAlso: ["truth-tables", "propositional-language"],
  },
  {
    term: "公理",
    aliases: ["axiom"],
    definition:
      "形式系统中不加证明就被接受的出发点公式，与推理规则一起生成全部定理。不同系统选不同的公理，公理集的强弱决定系统能证明什么。",
    seeAlso: ["proof-and-derivability", "hilbert-godel-metalogic"],
  },
  {
    term: "归纳",
    aliases: ["induction"],
    definition:
      "以“让结论更可信”为目标的一类推理：从样本到普遍、从过去到未来、从此例到彼例。前提全真时结论仍可能有反例。",
    confusion:
      "评价归纳用“强/弱”和“前提是否可信”，不能套用“有效/无效”——归纳本不承诺保真。遇到反例是削弱与限定结论，不等于归纳方法整体作废。",
    seeAlso: ["deduction-and-induction", "inductive-strength", "enumerative-induction"],
  },
  {
    term: "健全性",
    aliases: ["soundness", "可靠性"],
    definition:
      "健全的演绎论证等于形式有效加上全部前提真实，此时结论必然为真。论证不健全，原因要么在形式，要么在某条前提。",
    confusion:
      "与有效性分工：有效只看形式，健全还要逐条查前提。注意层次：这里说的是单个论证的健全；元逻辑里的可靠性定理说的是整个系统“凡可证皆有效”，两者不是一回事。",
    seeAlso: ["truth-validity-soundness", "soundness-completeness"],
  },
  {
    term: "结论",
    aliases: ["conclusion"],
    definition:
      "论证中说话者希望对方接受的命题，由前提支持。先问“作者最想让我接受哪一句”，再反推哪些句子在为它工作，这是重构论证的第一步。",
    seeAlso: ["argument-structure", "argument-mapping"],
  },
  {
    term: "解释",
    aliases: ["interpretation"],
    definition:
      "把形式语言的非逻辑符号落实为具体语义的安排：论域是什么、每个谓词对应哪个集合、每个常项指哪个对象、命题变元取什么真值。同一串公式在不同解释下真值可以不同。",
    seeAlso: ["predicate-language", "quantifiers"],
  },
  {
    term: "举证责任",
    aliases: ["burden of proof"],
    definition:
      "论辩中谁需要先给出理由、理由要达到什么程度的分工，通常由提出主张的一方承担。“未被证明”只说明责任未满足，不等于相反命题为真。",
    confusion:
      "“你拿不出反证，所以我对”把举证责任倒转给对方，是诉诸无知。检验办法是换位：若双方都只要求对方证伪，讨论永远无法收敛。",
    seeAlso: ["burden-of-proof", "argument-structure"],
  },
  {
    term: "可及关系",
    aliases: ["accessibility relation"],
    definition:
      "Kripke 语义中世界之间的“哪些情形与当前评价相关”关系；□P 与 ◇P 都按可及范围内的世界计算真值。对可及关系施加自反、传递等条件，就得到不同的模态系统。",
    seeAlso: ["possible-worlds-semantics", "necessity-possibility"],
  },
  {
    term: "可靠性定理",
    aliases: ["soundness theorem"],
    definition:
      "元定理：系统中一切可证的公式都有效，即语义上成立，记作 ⊢ 蕴含 ⊨。它与完全性定理一起说明语法推导与语义后承互相吻合。",
    confusion:
      "与单个论证的“健全性”分层：健全性评论证（形式有效加前提真），可靠性定理评系统（凡可证皆有效）。听到“可靠”二字，先问说的是论证还是系统。",
    seeAlso: ["soundness-completeness", "hilbert-godel-metalogic"],
  },
  {
    term: "可能",
    aliases: ["possibility"],
    definition:
      "◇P 表示 P 在至少一种相关可能情形中成立。“可能”同样要问范围：逻辑可能、物理可能、规则可能给出的答案可以不同。",
    confusion:
      "在自反框架中，P 真可推出 ◇P；一般 K 框架并不保证当前世界可及自身，所以这一步不能无条件使用。从 ◇P 也推不出 P，更推不出 □P。“明天可能下雨”不等于实际下雨，更不等于必然下雨。",
    seeAlso: ["necessity-possibility", "possible-worlds-semantics"],
  },
  {
    term: "可能世界",
    aliases: ["possible world"],
    definition:
      "一种完整且内部一致的情形刻画，用来给模态语句计算真值：必然真即在所有相关世界为真，可能真即在至少一个世界为真。它是语义工具，不必被读成“平行宇宙”式的形而上学承诺。",
    seeAlso: ["possible-worlds-semantics", "necessity-possibility"],
  },
  {
    term: "可判定性",
    aliases: ["decidability"],
    definition:
      "若存在算法，对任意公式都能在有限步内判定它是否属于某类（例如某系统的定理集），该类就叫可判定。命题逻辑可判定，一阶逻辑不可判定。",
    confusion:
      "与完全性区分：完全性说每个有效式都有证明，可判定性说还有一个保证停机的搜索程序；有证明存在不等于找得到。不完全性与不可判定性也是两个定理，引用时别捆在一起。",
    seeAlso: ["hilbert-godel-metalogic", "godel-incompleteness", "soundness-completeness"],
  },
  {
    term: "肯定后件",
    aliases: ["affirming the consequent"],
    definition:
      "无效推理形式：从 P→Q 与 Q 推出 P。后件成立说明不了走的是哪条路，条件句本身就不承诺“只有 P 能出 Q”。",
    confusion:
      "与肯定前件（P→Q 且 P 推 Q）只差一步方向：顺着条件走是肯定前件，有效；逆着条件回推是肯定后件，无效。检验口诀：问一句“除了 P 还有什么能让 Q 成立”，找得到就是肯定后件。",
    seeAlso: ["affirming-the-consequent", "natural-deduction"],
  },
  {
    term: "肯定前件",
    aliases: ["modus ponens"],
    definition:
      "基本有效推理形式：P→Q 且 P，推出 Q。它是自然演绎里使用频率最高的规则之一。",
    seeAlso: ["natural-deduction", "material-implication"],
  },
  {
    term: "宽容原则",
    aliases: ["principle of charity", "善意理解原则"],
    definition:
      "重构论证时，在文本与语境允许的范围内选择对说话者最有利的读法，不把对方读弱。宽容的对象是论证，不是结论——再不同意，也先把对方的理由摆到最强。",
    confusion:
      "宽容与稻草人相对：稻草人把对方读弱，宽容把对方读强且仍忠实。边界在忠实二字——补强到作者本人不会认账的程度，就不再是重构，而是替对方写新论证。",
    seeAlso: ["argument-structure", "argument-mapping", "burden-of-proof"],
  },
  {
    term: "类比",
    aliases: ["analogy"],
    definition:
      "由两对象在若干已知方面相似，推出它们在另一方面也相似的推理。强度取决于相似点与结论是否相关、已知差异是否致命。",
    seeAlso: ["analogical-argument", "inductive-strength"],
  },
  {
    term: "联结词",
    aliases: ["connective", "命题联结词"],
    definition:
      "把命题组合成复合命题的算子，常用的五个是 ¬（非）、∧（且）、∨（或）、→（蕴涵）、↔（等值）。真值函数联结词使复合命题的真值完全由成分真值决定。",
    seeAlso: ["propositional-language", "truth-tables"],
  },
  {
    term: "量词",
    aliases: ["quantifier"],
    definition:
      "说明“有多少对象满足条件”的逻辑算子，一阶逻辑主要用全称 ∀ 与存在 ∃。量词约束变元，并决定变元在公式中的辖域。",
    seeAlso: ["quantifiers", "quantifier-scope"],
  },
  {
    term: "论域",
    aliases: ["domain of discourse", "个体域"],
    definition:
      "量化语句谈论的对象全体，量词只在这个集合上取值。同一个 ∀x Fx，把论域从“本班学生”换成“所有人”，真值可能整个翻转。",
    seeAlso: ["quantifiers", "predicate-language", "multiple-quantification"],
  },
  {
    term: "论证",
    aliases: ["argument"],
    definition:
      "由若干前提支持一个结论的结构，评价对象是支持关系而非措辞激烈程度。描述、命令、提问和单纯解释原因都不构成论证。",
    seeAlso: ["argument-structure", "argument-mapping"],
  },
  {
    term: "矛盾式",
    aliases: ["contradiction", "永假式"],
    definition:
      "在所有赋值下都为假的公式，如 P∧¬P；真值表最后一列全假。若一组前提能推出矛盾式，这组前提就不一致。",
    seeAlso: ["truth-tables", "relevant-and-paraconsistent"],
  },
  {
    term: "谬误",
    aliases: ["fallacy"],
    definition:
      "有迷惑性且反复出现的坏论证模式：形式谬误（如肯定后件）坏在结构，非形式谬误（如稻草人、人身攻击）坏在内容与语境。",
    confusion:
      "给论证贴上谬误标签不等于完成反驳：先重构出论证，再说明该模式为何恰好在此处不成立。同一个模式在特定语境下也可能是有意的修辞，不能只按清单机械套用。",
    seeAlso: ["argument-structure", "affirming-the-consequent"],
  },
  {
    term: "模糊",
    aliases: ["vagueness"],
    definition:
      "谓词存在边界情形的性质：“秃”“高”“小雪”允许渐变与临界个案，没有现成的分界线。处理模糊通常靠约定阈值或分级刻画，而不是假装边界本来就有。",
    confusion:
      "与歧义分工：歧义是多义可选，选定读法即清楚；模糊是含义单一但边界不明。连锁悖论（一根一根拔头发，何时变秃）是模糊的典型症状，换定义消不掉，只能约定。",
    seeAlso: ["ambiguity-and-definition"],
  },
  {
    term: "模型",
    aliases: ["model"],
    definition:
      "使一组公式全部为真的解释：一个论域加上对各符号的具体语义安排。“理论有模型”即至少存在这样一种使它自洽的实现；找不到模型的公式组就不一致。",
    seeAlso: ["predicate-language", "truth-validity-soundness"],
  },
  {
    term: "偶真式",
    aliases: ["contingency", "偶然式"],
    definition:
      "既非重言式也非矛盾式的公式：在有些赋值下真，在另一些赋值下假。日常有实际内容的命题大多是偶真式。",
    seeAlso: ["truth-tables", "propositional-language"],
  },
  {
    term: "歧义",
    aliases: ["ambiguity"],
    definition:
      "同一表达带有多个可选的明确含义：词义歧义如“他走了一个钟头了”（步行还是离开），结构歧义如“咬死了猎人的狗”（动宾还是定语）。消除歧义靠替换词项或改写结构。",
    confusion:
      "与模糊分工：歧义是含义多而明确，选定就清楚；模糊是含义单一但边界不明。三段论里的四词项谬误，多半是中项在两个前提中悄悄换了含义。",
    seeAlso: ["ambiguity-and-definition", "categorical-syllogism"],
  },
  {
    term: "前提",
    aliases: ["premise"],
    definition:
      "论证中为结论提供理由的命题；一个论证可以有一个或多个前提。前提必须是可判断真假的完整命题，只交代背景或解释原因的句子不算。",
    confusion:
      "“他迟到是因为堵车”是在解释原因，不是在支持某个结论——解释与论证共用“因为”，功能不同。判别办法：这句话被拿来支持哪一句？哪一句都支持不了的，多半只是背景。",
    seeAlso: ["argument-structure", "argument-mapping"],
  },
  {
    term: "全称量词",
    aliases: ["universal quantifier", "∀"],
    definition:
      "∀x Fx 断言论域中每个对象都满足 F；带条件的全称句读作 ∀x(Fx→Gx)。它等值于 ¬∃x¬Fx，即“不存在不满足的”。",
    confusion:
      "“所有天鹅是白的”若世上并无天鹅，按 ∀x(S→W) 读法仍为真（空真）——现代逻辑的全称不带存在预设，日常说“所有”则通常默认有对象。所以驳全称句最直接的路线是找反例：一只非白天鹅就够了。",
    seeAlso: ["quantifiers", "quantifier-scope", "categorical-propositions"],
  },
  {
    term: "三段论",
    aliases: ["syllogism", "直言三段论"],
    definition:
      "由大前提、小前提与结论组成、恰好含三个词项的直言推理；中项在前提中连接大项与小项。有效性由格与式决定，可以用文氏图检验。",
    confusion:
      "结论听着顺不等于形式有效：“所有猫是动物；所有狗是动物；所以所有狗是猫”两前提皆真而结论为假，坏在中项“动物”两次都不周延。动手画文氏图，比背口诀可靠。",
    seeAlso: ["categorical-syllogism", "venn-diagram-testing", "categorical-propositions"],
  },
  {
    term: "实质蕴涵",
    aliases: ["material implication"],
    definition:
      "真值函数联结词 →：只有“前件真而后件假”一种情形使 P→Q 为假，其余情形（包括前件为假）都算真。它等值于 ¬P∨Q，是最薄的一层“如果…就…”。",
    confusion:
      "与日常条件句的差距：“如果月亮是奶酪做的，那么 2+2=4”按实质蕴涵为真，因为前件假；日常“如果就”还要求前后件有因果或推导联系。前件不可能真时后件任意都“真”，这就是实质蕴涵怪论，严格蕴涵是针对它的修补。",
    seeAlso: ["material-implication", "propositional-language", "necessity-possibility"],
  },
  {
    term: "推导",
    aliases: ["derivation"],
    definition:
      "从公理或前提出发、按系统规则逐行生成公式的有限序列，最后一行即定理或结论。推导是语法对象：只问规则允不允许，不问真假。",
    seeAlso: ["proof-and-derivability", "natural-deduction", "soundness-completeness"],
  },
  {
    term: "完全性定理",
    aliases: ["completeness theorem", "哥德尔完全性定理"],
    definition:
      "一阶逻辑的元定理（哥德尔，1930）：每个语义有效的公式都有语法证明，即 ⊨ 蕴含 ⊢。它与可靠性定理合起来说明，在一阶逻辑里有效与可证恰好重合。",
    confusion:
      "别与哥德尔不完全性定理混为一谈：完全性定理说的是一阶逻辑整体“能证明所有有效式”，不完全性说的是包含算术的足够强理论“有真而不可证的命题”。两定理名字像，对象不同，并不矛盾。",
    seeAlso: ["soundness-completeness", "godel-incompleteness", "hilbert-godel-metalogic"],
  },
  {
    term: "谓词",
    aliases: ["predicate"],
    definition:
      "带空位的性质或关系表达：一元谓词 F(x) 表示性质，二元谓词 L(x,y) 表示关系。谓词作用于论域中的对象，填满论元后才形成可判真假的公式。",
    seeAlso: ["predicate-language", "quantifiers"],
  },
  {
    term: "辖域",
    aliases: ["scope"],
    definition:
      "算子（量词、否定、模态词）作用的公式范围。¬∀xFx 与 ∀x¬Fx 只差辖域，意思就相反；模态词与量词的先后同样能改变真值。",
    confusion:
      "自然语言不标注辖域：“并非所有学生都及格”是 ¬∀x（及格），“所有学生都不及格”是 ∀x¬（及格）——语序一字之差，句义相反。形式化时先把否定、量词、模态词的先后写定，再动手推理。",
    seeAlso: ["quantifier-scope", "modal-scope", "multiple-quantification"],
  },
  {
    term: "小项",
    aliases: ["minor term"],
    definition:
      "直言三段论中充当结论主项的词项，出现在小前提里。大项加小项构成结论的两端，中项负责在前提中把它们搭起来。",
    seeAlso: ["categorical-syllogism", "categorical-propositions"],
  },
  {
    term: "形式系统",
    aliases: ["formal system"],
    definition:
      "由初始符号、形成规则、公理与推理规则共同定义的语言加推导装置。对系统本身还能再问一致性、完全性、可判定性，这类研究叫元逻辑。",
    seeAlso: ["proof-and-derivability", "hilbert-godel-metalogic", "godel-incompleteness"],
  },
  {
    term: "严格蕴涵",
    aliases: ["strict implication"],
    definition:
      "刘易斯为替代实质蕴涵提出的条件关系：P 严格蕴涵 Q 即 □(P→Q)，要求条件关系在所有可及可能世界中成立。现代模态逻辑由此起步。",
    confusion:
      "与实质蕴涵的区别：实质蕴涵只看真值，严格蕴涵要求“必然地 P→Q”，无关的偶然条件句不再自动为真。注意它仍有前件不可能时的空真现象，只是把怪论从“假前件”搬到了“不可能前件”。",
    seeAlso: ["material-implication", "necessity-possibility", "possible-worlds-semantics"],
  },
  {
    term: "演绎",
    aliases: ["deduction"],
    definition:
      "以“前提全真时结论必然为真”为目标的推理，从规则到事实、从定义到实例都是它的常态。它与归纳的分界不在方向，而在承诺：不允许前提真时结论有例外。评价演绎用有效与健全。",
    seeAlso: ["deduction-and-induction", "truth-validity-soundness", "natural-deduction"],
  },
  {
    term: "样本",
    aliases: ["sample"],
    definition:
      "归纳概括所依据的那部分对象。概括强度取决于样本规模与代表性：抽样方式偏了，数量再大也救不回来。",
    confusion:
      "“我身边的人都这么说”用的是便利样本，不代表总体；样本大也不等于有代表性——在线投票只覆盖愿意点开的人。先问抽样怎么来的，再看数量。",
    seeAlso: ["enumerative-induction", "inductive-strength"],
  },
  {
    term: "隐含前提",
    aliases: ["implicit premise", "省略前提"],
    definition:
      "论证依赖但未明说的前提，通常是连接明示前提与结论的桥梁。把它补出来，论证是否可靠才检查得起来。",
    confusion:
      "与背景信息分工：只有承担支持作用的命题才进论证骨架。“排长队所以好吃”里“排长队说明受欢迎”是隐含前提，“这条街很长”只是背景。补隐含前提要忠实：作者本人得认账。",
    seeAlso: ["argument-structure", "argument-mapping"],
  },
  {
    term: "一致性",
    aliases: ["consistency", "相容性"],
    definition:
      "一组语句或一个理论不导出矛盾的性质：语法上一致指推不出 P∧¬P，语义上一致指存在使它们全部为真的模型。在经典逻辑里两种刻画等价。",
    confusion:
      "一致不等于真：一套彼此相容的说法可能整体为假。不一致的代价更大——由爆炸原理，经典系统里不一致的理论能“证明”任何结论，所以查一致性是评价的第一道闸。",
    seeAlso: ["soundness-completeness", "relevant-and-paraconsistent", "hilbert-godel-metalogic"],
  },
  {
    term: "有效性",
    aliases: ["validity"],
    definition:
      "演绎论证的性质：不存在前提全真而结论为假的情形；只由形式决定，与前提的现实真假无关。有效保证的是“如果前提真，结论就不会假”。",
    confusion:
      "与健全性分工：健全等于有效加前提全真。也别拿“结论是真的”当有效证据——结论碰巧为真、前提与结论毫无支持的论证比比皆是，检验有效要抽形式找反模型。",
    seeAlso: ["truth-validity-soundness", "deduction-and-induction"],
  },
  {
    term: "真值函数",
    aliases: ["truth function"],
    definition:
      "整体真值完全由成分命题真值决定的函数，五个常用联结词都是真值函数。算 P∧Q 的真假不需要知道 P、Q 具体说了什么。",
    seeAlso: ["propositional-language", "truth-tables"],
  },
  {
    term: "直言命题",
    aliases: ["categorical proposition"],
    definition:
      "由量项、主项、联项、谓项组成的四种基本句型：A（所有S是P）、E（所有S不是P）、I（有的S是P）、O（有的S不是P）。对当方阵与三段论都在这四种句型上展开。",
    confusion:
      "“所有S是P”的否定是“有的S不是P”（O 命题），不是“所有S不是P”（E 命题）——全称肯定句被一个反例推翻后，得到的是特称否定句。",
    seeAlso: ["categorical-propositions", "venn-diagram-testing", "categorical-syllogism"],
  },
  {
    term: "中项",
    aliases: ["middle term"],
    definition:
      "在两个前提中都出现、结论中不出现的词项，负责连接大项与小项。有效三段论要求中项至少周延一次，否则两端搭不上桥。",
    confusion:
      "中项在两个前提里同名不同义时，三段论实际有四个词项，这就是四词项谬误：“好学生都爱提问”与“他最近很爱提问”里的“爱提问”，若一个指课堂上主动发言、一个指缠着家长问作业，中项就换了含义，推理随之断裂。",
    seeAlso: ["categorical-syllogism", "categorical-propositions"],
  },
  {
    term: "周延",
    aliases: ["distribution", "周延性"],
    definition:
      "直言命题对词项的全部外延作出断定的状态：A 周延主项，E 周延主项和谓项，I 两项都不周延，O 只周延谓项。周延与否由命题形式决定。",
    confusion:
      "周延看形式断定了多少，不看词项实际外延多大：“所有鱼是动物”里“动物”虽是很大的类，作为 A 命题的谓项仍不周延。从“有的S是P”可以换位成“有的P是S”，从“所有S是P”推出“所有P是S”不行——错在把不周延的谓项当周延用。",
    seeAlso: ["categorical-propositions", "categorical-syllogism", "venn-diagram-testing"],
  },
  {
    term: "自由变元",
    aliases: ["free variable"],
    definition:
      "未被量词约束的变元。Fx 单独出现时 x 自由，公式没有固定真值，要靠赋值指定对象，或加量词、或取全称闭包，才成为可判真假的语句。",
    seeAlso: ["quantifiers", "quantifier-scope", "predicate-language"],
  },
  {
    term: "最佳解释推理",
    aliases: ["inference to the best explanation", "溯因推理"],
    definition:
      "在若干候选解释中挑选解释力最强者——能解释的事实更多、假设更少更独立——并暂时接受它。医生诊断、故障排查、科学假说评估都是这个模式。",
    confusion:
      "与枚举归纳方向相反：归纳从样本推向普遍，最佳解释推理从结果回推原因。它给出的也是可修正的结论：“最合理的解释”不等于“为真”，竞争力取决于有没有认真找过替代解释。",
    seeAlso: ["inference-to-best-explanation", "inductive-strength"],
  },
];
