# lumo-ui

个人组件库母版仓库。**Base UI 提供行为，Tailwind v4 提供样式，CSS 变量提供主题。**

不发布 npm 包——它就是一个 shadcn registry：组件由 shadcn CLI 装进项目自己的 aliases
（`@/components/ui`、`@/lib`），主题由 CLI 合并进项目自己的 CSS，已经装过的文件内容相同就跳过，
所以一个 Button 只存在一份，后面装的组件都用它。

仓库：<https://github.com/linyana/lumo-ui>

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
| `bun run registry:build` | 生成 `public/r/*.json`（CLI 真正下载的东西，`bun run build` 会自动跑）|
| `bun run registry:check` | 用 shadcn CLI 校验 `registry.json` 本身 |
| `bun run registry:sync` | 按磁盘补齐 `registry.json`（加完组件后跑） |
| `bun run llms:build` | 生成 `public/llms.txt`、`public/llms-full.txt` 和 `public/docs/*.md`（给 AI 的入口，`bun run build` / `bun run dev` 会自动跑） |

## 目录

```
src/
├── components/ui/                # 原子，一个组件一个文件，小写
│   ├── button.tsx                # ★ 单部件就是这一个文件，加新组件前先读它
│   ├── dialog.tsx                # 多部件的全在一个文件里，末尾汇成 Dialog 命名空间
│   └── …
├── components/blocks/            # 组合，一个组件一个目录，小写
│   └── layout/                   # 应用外壳：sidebar、header、content
│       ├── index.tsx
│       ├── types.ts
│       └── sidebar/index.tsx
├── lib/utils.ts                  # cn()：clsx + tailwind-merge
├── styles/
│   ├── lumo-tokens.css           # ★ 全部视觉常量都在这里，也是 @lumo/theme 的源
│   ├── lumo-palette.css          # 默认配色，@lumo/palette 的源
│   └── index.css                 # demo 入口，不分发
├── pages/                        # 文档页，一个组件一页
└── App.tsx                       # 外壳：把路由接到 Layout 上
scripts/check-registry.ts         # registry.json 与磁盘的同步检查（--fix 即 sync）
scripts/theme.ts                  # 两份 CSS → theme / palette 两个 item
scripts/llms.ts                   # 站点 → llms.txt / llms-full.txt / docs/*.md（给 AI 读的同一套）
registry.json                     # 分发定义
public/r/                         # 生成的 registry JSON，随站点部署（不入库）
AGENTS.md                         # 给 AI 的项目规范
```

`ui/` 里的每个组件是一条 `registry:ui`、装进项目里就是一个 `.tsx`；`blocks/` 里的是
`registry:block`、装进去是一个目录。层决定类型和形状，写错 `bun run check` 会当场拦下来。
两层都能一条命令装进项目里。

## 怎么加一个组件

1. 先定层：`ui/` 是能单独用的原子（一个文件），`blocks/` 是由原子拼出来的组合（一个目录）
2. 先读 `src/components/ui/button.tsx`
3. ui 组件：建 `src/components/ui/<name>.tsx`（小写，与 item 同名），多部件的都写在这一个文件里，
   末尾汇成 `export const Dialog = { Root, Trigger, Popup, … }`（part 依旧各自 `export`——别的组件可能来拿）
4. blocks 组件：建 `src/components/blocks/<name>/index.tsx`，按需要给 part 分目录
   （`layout/sidebar/index.tsx`）
5. 所有颜色/圆角/间距用 token（`bg-primary`、`rounded-md`），**不许硬编码**
6. 不要写 focus 样式——焦点样式只在 `lumo-tokens.css` 里定义一次
7. 在 `registry.json` 里按文件名/目录名加一条 item（`type` 按层给 `registry:ui` / `registry:block` / `registry:lib`），`files` 先写一个锚点即可
8. `bun run registry:sync`——目录里其余文件自动补进去；ui 与 lib **不写 target**（落地位置由消费者的 alias 决定），block 的 target 自动生成为 `@components/…`
9. 在 `src/pages/` 里加一页 demo，方便看效果
10. `bun run check` 必须过（漏声明、类型和层对不上、ui 不是一个文件、import 的包没声明都会报错）

## 分发到项目里

`bun run build` 会把 `registry.json` 编译成 `public/r/*.json` 随站点一起部署，站点本身就是 registry
（`<站点>/r/button.json`）。项目里先声明一次命名空间：

```json
// components.json（或 package.json，二者皆可）
"registries": { "@lumo": "https://<你的站点>/r/{name}.json" }
```

然后：

```bash
# 装一个组件（npm 依赖会自动装上）
bunx shadcn@latest add @lumo/button

# 装一个 block（连它依赖的 ui 组件一起装上）
bunx shadcn@latest add @lumo/layout

# 样式：theme 必需，palette 只在项目自己没有配色时装
bunx shadcn@latest add @lumo/theme
bunx shadcn@latest add @lumo/palette
```

装完在项目里这样引入（路径就是你的 `components.json` 里的 alias，没有统一入口）：

```ts
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
```

**依赖不写版本**：`registry.json` 里的 npm 包一律是裸名字，装的时候 CLI 取 `latest`。所以仓库自己
必须先在最新 major 上跑通——`bun outdated` 看有没有落后，`bun add <name>@latest` 跟上；`bun run check`
会挡住「item 声明了某个包、但 `package.json` 没声明」的情况，让两边不会分家。

组合一律走 Base UI 的 `render`（不是 `asChild`）：`<Dialog.Trigger render={<Button />} />`。
这也是 shadcn 自己的方向——它的 `@shadcn/react` 就是 base-ui `useRender` 的移植——所以拿 Base UI
来对照就够，不用去追 Radix 时代的写法。

装之前可以先看：

```bash
bunx shadcn@latest view @lumo/button
bunx shadcn@latest add @lumo/button --dry-run
```

改完 registry 记得验证：

```bash
bun run registry:sync   # 先把漏声明的文件补进 registry.json
bun run registry:check  # 再用 shadcn CLI 校验 registry.json 本身
```

### 复用是默认行为

每个 item 的 `registryDependencies` 声明的就是它用到的组件（`@lumo/utils`、`@lumo/control`…），
所以装第二个组件时，已经装过的文件会先比对内容：一样就 `Skipped`（不重写、不报错），不一样
才会问你一句要不要覆盖。已经改过的 Button 不会被新组件偷偷改回去：

```
✔ Created 1 file:
  - src/components/ui/table.tsx
ℹ Skipped 2 files: (files might be identical, use --overwrite to overwrite)
  - src/lib/utils.ts
  - src/lib/control.ts
```

### 和已有 shadcn 项目共存

落点就是 shadcn 自己的 `components/ui/`，两边可以混用。主题分得很清：

- `@lumo/theme` 是组件**必需**的（映射、交互时长、焦点环、`--success` 这类 shadcn 不定义的变量），
  它会写进项目的 `:root`/`.dark`/`@theme inline` 和 base 层；
- `@lumo/palette` 只是**默认配色**，装它只会补项目里缺的变量，你已有的 `--primary`、`--radius`
  不会被改。

## 给 AI 读的入口

站点同时是给 agent 的文档源，和 ant.design 的 `llms.txt` 是一回事：

| 地址 | 内容 |
|---|---|
| `/llms.txt` | 索引：这是什么、怎么装、写代码时的规矩，然后按层列出每个 item 并链到它的 markdown |
| `/llms-full.txt` | 上面全部，加上每个 item 的源码和示例，一次取完 |
| `/docs/<name>.md` | 单个 item：装法、它复制的源码、页面上那些示例 |
| `/docs/agents.md` | 就是这份 `AGENTS.md` |

三份都是 `scripts/llms.ts` 从 `registry.json` 和页面目录（`src/pages/Button/demos` 就是
`@lumo/button`）生成的，写进 `public/` 随站点部署、不入库。所以**改内容改源头**：组件的
`title` / `description`、它的源码、示例，以及 `AGENTS.md`——生成物不用手改。加一个组件时也
什么都不用多做，索引和 markdown 会自动带上它。

## 改主题

改 `src/styles/lumo-tokens.css` 一个值，所有组件跟着变；`bun run registry:sync` 会把它同步进
`registry.json` 的 `theme` item，消费者装到的就是同一个值（手改 `registry.json` 里的
`cssVars` 会被覆盖）。

```css
/* src/styles/lumo-palette.css — 默认配色，@lumo/palette 的源 */
:root {
  --radius: 0.625rem;   /* 改这里，整个圆角阶梯按 calc 比例缩放 */
  --primary: oklch(0.205 0 0);
}

/* src/styles/lumo-tokens.css — 组件读的常量，@lumo/theme 的源 */
:root {
  --duration-state: 150ms;
  --press-offset: 1px;
}
```

想整体换配色，直接抄一份社区主题（tweakcn、shadcn/create 导出的就是同名变量块）替换 `:root` 和 `.dark` 即可。

## 焦点环

默认是 1px 细环，定义在 `lumo-tokens.css` 的 `:focus-visible` 里——**只有那一处**。
想更淡就改 `--ring` 的值；想彻底去掉就删掉那条规则。

保留一点可见性是有意的：完全没有焦点提示，键盘用户会不知道自己在哪。
