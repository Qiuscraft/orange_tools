# Orange Tools

Orange Tools 是一个基于 `Nuxt 4 + Vue 3` 的前端工具库站点。当前首版已经落地两个页面：

- 导航首页 `/`
- 文本差异可视化工具页 `/git-diff`

项目目标不是做一套通用后台，而是持续沉淀一组“本地优先、打开即用、单点能力强”的开发辅助工具。

## 当前技术栈

- `Nuxt 4`
- `Vue 3`
- `Nuxt UI`
- `Tailwind CSS`
- `diff`
- `Vitest`

## 页面与路由

- `/`
  Orange Tools 导航首页。负责展示品牌信息、工具入口和未来工具占位，不承载具体工具逻辑。
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
  首页，负责品牌化 Hero、工具列表和入口跳转。
- [app/pages/git-diff.vue](/Users/bytedance/WebstormProjects/orange_tools/app/pages/git-diff.vue)
  Git Diff 页，负责输入区、操作区、Diff 结果区和页面级状态管理。

### 3. 组件层

- [app/components/ToolCard.vue](/Users/bytedance/WebstormProjects/orange_tools/app/components/ToolCard.vue)
  首页工具卡片组件。只关心工具元数据的展示，不耦合具体工具实现。
- [app/components/GitDiffViewer.vue](/Users/bytedance/WebstormProjects/orange_tools/app/components/GitDiffViewer.vue)
  Diff 展示组件。负责左右分栏、行号、行级背景色、词级高亮和摘要统计展示。

### 4. 领域逻辑层

- [app/utils/toolCatalog.ts](/Users/bytedance/WebstormProjects/orange_tools/app/utils/toolCatalog.ts)
  工具目录的静态元数据源。首页和后续导航可以持续复用这份数据。
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
  - 暖橙色品牌色变量
  - 全局背景和网格氛围
  - 玻璃态面板样式
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

- `context`
- `added`
- `removed`
- `modified`

这套模型让 UI 不需要关心 diff 库的原始输出结构，只要按标准行渲染即可。

## 目录结构

```text
app/
  app.vue
  assets/
    css/
      main.css
  components/
    GitDiffViewer.vue
    ToolCard.vue
  layouts/
    default.vue
  pages/
    git-diff.vue
    index.vue
  utils/
    gitDiff.ts
    toolCatalog.ts
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

- 当前构建过程中可能看到字体源抓取失败的 warning。
  这是 `Nuxt UI` 相关字体提供方在无外网环境下不可访问导致的警告，不影响本项目当前构建产物生成。
- Git Diff 首版是“阅读器”定位，不是完整编辑器。
  当前没有接入 Monaco、文件上传、本地持久化和同步滚动等增强功能。

## 后续扩展建议

- 为 `Git Diff` 增加实时比对开关
- 增加同步滚动和视图折叠
- 支持上传两个文件做对比
- 扩展新的工具页，并继续复用 `toolCatalog` 作为统一导航元数据源
