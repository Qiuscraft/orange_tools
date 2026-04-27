# Orange Tools

Orange Tools 是一个基于 `Nuxt 4 + Vue 3` 的本地优先工具站点。当前版本保留两个页面：

- 极简首页 `/`
- 文本差异可视化工具页 `/git-diff`

项目目标不是做一套通用后台，而是持续沉淀一组"本地优先、打开即用、单点能力强"的开发辅助工具。当前首页已经收敛为单入口设计，只突出已上线的 `Git Diff`，不再展示未来工具占位。

**语言**: 当前站点已全面采用中文作为主要语言，包括页面文案、按钮文本、提示信息等所有用户可见内容。

## 当前技术栈

- `Nuxt 4`
- `Vue 3`
- `Nuxt UI`
- `Tailwind CSS`
- `diff`
- `Vitest`

## 页面与路由

- `/`
  Orange Tools 极简首页。负责展示站点定位、当前唯一主工具入口，以及简洁的产品说明，不承载具体工具逻辑。
- `/git-diff`
  Git Diff 工具页。接受两段文本作为输入，并以类似 VS Code / 代码托管平台的方式展示可视化差异。

## 架构概览

### 1. 应用入口

- [app/app.vue](/Users/bytedance/WebstormProjects/orange_tools/app/app.vue)
  使用 `UApp` 包裹整个应用，挂载 `NuxtLayout` 和 `NuxtPage`，同时接入 `NuxtLoadingIndicator`。
- [app/layouts/default.vue](/Users/bytedance/WebstormProjects/orange_tools/app/layouts/default.vue)
  作为默认布局，负责站点级头部导航、页面容器宽度和全局壳层结构。

### 2. 页面层

- [app/pages/index.vue](/Users/bytedance/WebstormProjects/orange_tools/app/pages/index.vue)
  首页，负责极简 Hero、主路由提示和 Git Diff 入口跳转。所有文案已统一为中文。
- [app/pages/git-diff.vue](/Users/bytedance/WebstormProjects/orange_tools/app/pages/git-diff.vue)
  Git Diff 页，负责输入区、操作区、Diff 结果区和页面级状态管理；当前用户可见文案已统一为中文。

### 3. 组件层

- [app/components/GitDiffViewer.vue](/Users/bytedance/WebstormProjects/orange_tools/app/components/GitDiffViewer.vue)
  Diff 展示组件。负责左右分栏、行号、行级背景色、词级高亮和摘要统计展示。

### 4. 领域逻辑层

- [app/utils/gitDiff.ts](/Users/bytedance/WebstormProjects/orange_tools/app/utils/gitDiff.ts)
  Git Diff 的核心逻辑，负责：
  - 统一换行符
  - 基于 `diffLines` 做主差异块切分
  - 对成对的增删块再用 `diffArrays` 细分为上下文 / 修改 / 新增 / 删除
  - 对修改行再用 `diffWordsWithSpace` 做词级高亮
  - 产出适合 UI 直接消费的 `DiffRow[]` 和摘要统计

### 5. 样式层

- [app/assets/css/main.css](/Users/bytedance/WebstormProjects/orange_tools/app/assets/css/main.css)
  全局样式入口。这里接入了：
  - `@import "tailwindcss"`
  - `@import "@nuxt/ui"`

  同时定义了 Orange Tools 当前的视觉基线：
  - 更接近 Nuxt 原生观感的绿色主色变量
  - 更克制的浅色背景和网格氛围
  - 轻量玻璃态面板样式
  - diff token 的增删高亮色

## Git Diff 页的实现思路

### 输入与交互

Git Diff 页当前采用“双文本输入区 + 手动触发比对”的设计：

- `Compare`
  把当前左右输入提交为本次比对内容
- `Swap`
  左右输入互换，并立即重新比较
- `Clear`
  清空输入和结果
- `Load Example`
  加载默认示例，便于直接查看效果

这样做的原因是首版优先保证结果稳定、逻辑清晰，不引入过多编辑器级复杂交互。

页面文案当前统一使用英文，以保持首页与工具页的一致性。

### 数据流

页面层维护四份核心状态：

- `leftInput`
- `rightInput`
- `comparedLeft`
- `comparedRight`

输入区可以持续编辑，但只有触发 `Compare` 后，`comparedLeft/right` 才会更新。`GitDiffViewer` 只消费比对后的结果，不直接绑定原始输入状态。

### Diff 算法分层

`buildGitDiff(before, after)` 的输出是标准化的 `DiffResult`：

- `rows`
  供 UI 渲染的行数组，每行包含左右行号、左右文本、行类型、词级 token
- `summary`
  当前结果里的 `added / removed / modified / unchanged` 计数

处理分为三层：

1. 先做整段行级 diff
   使用 `diffLines` 找到大块的上下文、删除块和新增块。
2. 再处理成对的删改块
   对一组“删除块 + 新增块”使用 `diffArrays` 做行数组级别的二次对比，避免把本可复用的上下文行误判成修改行。
3. 最后做修改行词级高亮
   对 `modified` 行使用 `diffWordsWithSpace`，分别构造左右 token，供前端高亮显示。

### UI 表达

结果区采用左右分栏结构，每行统一映射为下列之一：

- `context` - 上下文（未变化）
- `added` - 新增
- `removed` - 删除
- `modified` - 修改

这套模型让 UI 不需要关心 diff 库的原始输出结构，只要按标准行渲染即可。

所有用户界面文案已统一采用中文，包括：
- 页面标题和描述
- 按钮文本
- 输入提示
- 状态信息
- 统计标签

## 目录结构

```text
app/
  app.vue
  assets/
    css/
      main.css
  components/
    GitDiffViewer.vue
  layouts/
    default.vue
  pages/
    git-diff.vue
    index.vue
  utils/
    gitDiff.ts
tests/
  gitDiff.spec.ts
nuxt.config.ts
package.json
```

## 运行与验证

安装依赖：

```bash
npm install
```

启动开发环境：

```bash
npm run dev
```

运行单元测试：

```bash
npm test
```

构建生产版本：

```bash
npm run build
```

本项目当前已经验证通过：

- `npm test`
- `npm run build`

## 已有测试覆盖

- 完全相同文本
- 纯新增
- 纯删除
- 单行修改
- 不等长替换块
- Windows 换行符归一化

测试文件位于 [tests/gitDiff.spec.ts](/Users/bytedance/WebstormProjects/orange_tools/tests/gitDiff.spec.ts)。

## 已知说明

- Git Diff 首版是“阅读器”定位，不是完整编辑器。
  当前没有接入 Monaco、文件上传、本地持久化和同步滚动等增强功能。
- 首页当前是单工具入口，不再承担工具目录或路线图展示职责。

## 后续扩展建议

- 为 `Git Diff` 增加实时比对开关
- 增加同步滚动和视图折叠
- 支持上传两个文件做对比
- 如果未来重新引入多工具导航，再按实际需求补回目录元数据层，而不是提前保留占位结构
