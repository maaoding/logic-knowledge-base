export interface ResourceItem {
  title: string;
  url: string;
  note: string;
  caution?: string;
}

export interface ResourceGroup {
  slug: string;
  heading: string;
  intro: string;
  items: ResourceItem[];
}

export function resourceGroupId(group: Pick<ResourceGroup, "slug">) {
  return `resource-${group.slug}`;
}

export const resourcesIntro =
  "本站之外的稳定学习资源，按用途分组。每项说明它适合解决什么问题；使用外部资源时，优先核对原始定义与例子，而不是只读二手转述。";

export const resourceGroups: ResourceGroup[] = [
  {
    slug: "encyclopedias",
    heading: "在线百科与词条",
    intro: "查术语、核对定义、寻找进阶文献的起点。",
    items: [
      {
        title: "斯坦福哲学百科全书（SEP）",
        url: "https://plato.stanford.edu/",
        note: "学术界维护的权威百科，逻辑学各分支都有由领域学者撰写并持续更新的长文，附大量文献目录。",
        caution: "英文长文，难度偏研究向；适合核对概念与延伸阅读，不适合作为第一遍入门材料。",
      },
      {
        title: "互联网哲学百科全书（IEP）",
        url: "https://iep.utm.edu/",
        note: "同行评审的免费哲学百科，条目比 SEP 短，入门更友好，经典主题（三段论、模态、谬误）覆盖完整。",
        caution: "更新节奏不如 SEP，同一个主题可与 SEP 对照着读。",
      },
    ],
  },
  {
    slug: "open-textbooks",
    heading: "开放教材",
    intro: "免费、可自由下载的系统教材，结构清晰，适合配合本站条目逐章推进。",
    items: [
      {
        title: "forall x: Calgary",
        url: "https://forallx.openlogicproject.org/",
        note: "开源英文形式逻辑教材，从命题逻辑讲到一阶逻辑与元理论，习题丰富，语言直白。",
        caution: "使用 TFL/FOL 记号体系，与本站符号略有差异，切换时先对照联结词表。",
      },
      {
        title: "Open Logic Project",
        url: "https://openlogicproject.org/",
        note: "可自由重组的开源教材库，覆盖可计算性、不完全性、模型论与集合论，适合进阶数理逻辑。",
        caution: "定位是高年级与研究生教材，零基础读者建议先读完本站进阶分支再进入。",
      },
      {
        title: "《逻辑学十五讲》（陈波，北京大学出版社）",
        url: "https://www.pup.cn/",
        note: "中文原创入门读物，按十五个专题展开，兼顾逻辑史与非形式逻辑，可当课外读物配本站学习路径。",
        caution: "图书页面请在出版社官网或书店核实版次；不同印次章节编排可能不同。",
      },
    ],
  },
  {
    slug: "interactive-tools",
    heading: "交互工具",
    intro: "动手验证真值表、构造证明的在线工具，练形式逻辑比纸上快。",
    items: [
      {
        title: "Logicly",
        url: "https://logic.ly/",
        note: "拖拽式命题逻辑练习环境：搭公式、画真值表、验证等值，适合命题逻辑分支的配套练习。",
        caution: "完整功能付费，免费试用已够学习使用。",
      },
      {
        title: "Truth Table Generator（truth-table.com）",
        url: "https://truth-table.com/",
        note: "输入公式自动生成完整真值表，用来核对自己手制的真值表，专治列行数错误。",
        caution: "记号风格可切换；用它验证结果，但制表过程要自己走一遍才有练习价值。",
      },
      {
        title: "Carnap",
        url: "https://carnap.io/",
        note: "在线逻辑作业平台，支持多套自然演绎系统的证明逐行检查，写错哪一步会即时指出。",
        caution: "面向教学场景，界面朴素；不同系统的规则名称先读它的文档。",
      },
    ],
  },
  {
    slug: "courses-and-videos",
    heading: "课程与视频",
    intro: "有人讲解、有节奏的课程，适合自学卡壳时换一条通道。",
    items: [
      {
        title: "Coursera：Think Again 系列（杜克大学）",
        url: "https://www.coursera.org/",
        note: "面向大众的批判性思维与论证分析课程，与本站非形式逻辑分支高度互补。",
        caution: "在 Coursera 站内搜索课程名确认当前开课状态；免费旁听即可满足学习需要。",
      },
      {
        title: "中国大学 MOOC（icourse163.org）",
        url: "https://www.icourse163.org/",
        note: "多所高校常年开设《逻辑学》《批判性思维》课程，中文授课，跟随学期开课。",
        caution: "课程随学期上下线，站内搜索“逻辑学”后按开课学校和评价挑选。",
      },
    ],
  },
];
