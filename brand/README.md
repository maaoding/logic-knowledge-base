# 站点图标：⊢ turnstile

以 `public/og.png` 的暖象牙 + 深墨蓝视觉语言为参照设计的方形象站图标主图。
符号为单个逻辑turnstile ⊢：一根竖杠中点接一根向右延伸的横杠，直角硬边、无渐变无阴影。

## 色板

| 用途 | 色值 | 来源 |
| --- | --- | --- |
| 背景 · 暖象牙 | `#F5EFE3` | 采样自 `public/og.png` 底色 |
| 符号 · 深墨蓝 | `#0D2A44` | 沿用 `app/icon.png` 现有符号色，对比度约 13:1 |
| 点缀 · 锈红（仅 accent 变体） | `#AE4F2D` | 采样自 `public/og.png` 强调色 |

## 几何

- 512 设计稿：标记外框 `[92, 420]²`，四边留 18% 安全边距，居中。
- 笔画宽 64px（16px 尺寸下约 2px），竖杠与横杠等宽、直角相接。
- 16 / 32 / 48 / 180 各尺寸按同一比例手工对齐到整数像素，边缘无重采样模糊。

## 文件

| 文件 | 说明 |
| --- | --- |
| `turnstile-icon-512.png` / `turnstile-icon.svg` | 主图（推荐），512px 位图与矢量源 |
| `turnstile-icon-accent-512.png` / `turnstile-icon-accent.svg` | 备选变体：横臂末端 30% 为锈红点缀 |
| `apple-touch-icon-180.png` | Apple touch icon，180px |
| `favicon-16.png` / `favicon-32.png` / `favicon-48.png` | 各尺寸 favicon |
| `favicon.ico` | 内含 16 / 32 / 48 三档 |
| `size-preview.png` | 各尺寸实际渲染预览 |
| `build_icons.py` | 重新生成以上全部文件：`python brand/build_icons.py` |

## 接入（Next.js App Router，未自动执行）

需要替换现有图标时：

1. `turnstile-icon-512.png` → 覆盖 `app/icon.png`
2. `apple-touch-icon-180.png` → 覆盖 `app/apple-icon.png`
3. `favicon.ico` → 覆盖 `app/favicon.ico`

主图不包含锈红点缀（16px 下点缀会削弱横杠的整体性）；若偏好点缀效果，用
`turnstile-icon-accent-512.png` 执行第 1 步即可。
