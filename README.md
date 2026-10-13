# lumo-ui

个人组件库母版仓库。**Base UI 提供行为，Tailwind v4 提供样式，CSS 变量提供主题。**

不发布 npm 包——组件通过 GitHub registry 一条命令复制进各个项目。

## 技术栈

| | |
|---|---|
| 运行时 / 包管理 | Bun 1.3 |
| 行为层 | `@base-ui/react` 1.9 — 无样式、无 CSS 依赖、自带无障碍与焦点管理 |
| 样式 | Tailwind CSS v4（CSS-first 配置） |
| 主题 | CSS 变量，命名沿用 shadcn 约定（社区主题可直接拿来用） |
| 变体 | `tailwind-variants` |
| 构建 | Vite 8 + React 19 + TypeScript 7 |
| 检查 | oxlint（lint）+ oxfmt（格式化）|

风格与 `lumo-code` 对齐：tab 缩进、单引号、100 列、LF 换行。

## 开始

```bash
bun install
bun run dev      # 打开 demo，边改边看
bun run check    # 格式 + lint + 类型，三合一
bun run build    # 生产构建
```

| 命令 | 作用 |
|---|---|
| `bun run check` | 完整检查，出错即失败（提交前跑这个）|
| `bun run check:fix` | 同上，但自动修格式、lint 和 `registry.json` |
| `bun run format` / `bun run lint` | 单独跑其中一个 |
| `bun run typecheck` | 只跑类型 |
| `bun run registry:check` | 用 shadcn CLI 校验 `registry.json` 本身 |
| `bun run registry:sync` | 按磁盘补齐 `registry.json`（加完组件后跑） |

## 目录

```
src/
├── components/lumo/              # 库的本体，一个组件一个 PascalCase 目录
│   ├── Button/
│   │   └── index.tsx             # ★ 实现就在 index.tsx，加新组件前先读它
│   └── Dialog/
│       ├── index.tsx             # 组装并导出 Dialog 命名空间
│       ├── Root/index.tsx        # 每个 part 一个目录
│       ├── Trigger/index.tsx
│       ├── Portal/index.tsx
│       ├── Close/index.tsx
│       ├── Backdrop/index.tsx
│       ├── Viewport/index.tsx
│       ├── Popup/index.tsx
│       ├── Title/index.tsx
│       └── Description/index.tsx
├── lib/cn.ts                     # clsx + tailwind-merge
├── styles/
│   ├── lumo-tokens.css           # ★ 全部视觉常量都在这里（可独立分发）
│   └── index.css                 # demo 入口，不分发
└── App.tsx                       # demo 页面
scripts/check-registry.ts         # registry.json 与磁盘的同步检查（--fix 即 sync）
registry.json                     # 分发定义
AGENTS.md                         # 给 AI 的项目规范
```

## 怎么加一个组件

1. 先读 `src/components/lumo/Button/`
2. 建 `src/components/lumo/<Name>/index.tsx`——PascalCase 目录，实现直接写在 index.tsx
3. 多部件组件：**每个 part 一个目录**（`Dialog/Popup/index.tsx`），父级 index.tsx 组装成命名空间对象
4. 所有颜色/圆角/间距用 token（`bg-primary`、`rounded-md`），**不许硬编码**
5. 不要写 focus 样式——焦点样式只在 `lumo-tokens.css` 里定义一次
6. 在 `registry.json` 里加一条 item，`files` 里**只写该目录下任意一个文件的路径**，当锚点
7. `bun run registry:sync`——该目录下其余文件自动补进去，target 一并生成
8. 在 `src/App.tsx` 里用上，方便看效果
9. `bun run check` 必须过（漏声明、target 不镜像都会报错）

## 分发到项目里

推到 GitHub 后（`registry.json` 里的用户名已填成 `linyana`），在任何项目里：

```bash
# 装一个组件（依赖会自动连带装上）
bunx shadcn@latest add linyana/lumo-ui/button

# 装主题变量（项目里已经有 shadcn 主题的话，跳过这步）
bunx shadcn@latest add linyana/lumo-ui/theme
```

装完在项目里这样引入（路径带组件名，没有统一入口）：

```ts
import { Button } from '@/components/lumo/Button';
import { Dialog } from '@/components/lumo/Dialog';
```

装之前可以先看：

```bash
bunx shadcn@latest view linyana/lumo-ui/button
bunx shadcn@latest add linyana/lumo-ui/button --dry-run
```

改完 registry 记得验证：

```bash
bun run registry:sync   # 先把漏声明的文件补进 registry.json
bun run registry:check  # 再用 shadcn CLI 校验 registry.json 本身
```

### 装进「已经在用 shadcn」的项目

可以共存，`target` 全部落在 `src/components/lumo/`，不碰 shadcn 的 `src/components/ui/`。
**注意**：如果那个项目已经有主题变量（`:root` 里定义了 `--primary`、`--radius` 等），
**不要装 `theme`**，你的组件会直接吃他的配色。

## 改主题

改 `src/styles/lumo-tokens.css` 一个值，所有组件跟着变：

```css
:root {
  --radius: 0.625rem;   /* 改这里，整个圆角阶梯按 calc 比例缩放 */
  --primary: oklch(0.205 0 0);
}
```

想整体换配色，直接抄一份社区主题（tweakcn、shadcn/create 导出的就是同名变量块）替换 `:root` 和 `.dark` 即可。

## 焦点环

默认是 1px 细环，定义在 `lumo-tokens.css` 的 `:focus-visible` 里——**只有那一处**。
想更淡就改 `--ring` 的值；想彻底去掉就删掉那条规则。

保留一点可见性是有意的：完全没有焦点提示，键盘用户会不知道自己在哪。
