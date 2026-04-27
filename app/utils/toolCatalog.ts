export type ToolStatus = 'live' | 'planned'

export interface ToolItem {
  title: string
  slug: string
  description: string
  href?: string
  status: ToolStatus
  eyebrow: string
}

export const toolCatalog: ToolItem[] = [
  {
    title: 'Git Diff',
    slug: 'git-diff',
    description: '输入两段文本，按类似 VS Code 的方式查看增删改，并对修改行做词级高亮。',
    href: '/git-diff',
    status: 'live',
    eyebrow: 'Text Inspection'
  },
  {
    title: 'JSON Explorer',
    slug: 'json-explorer',
    description: '后续会补上 JSON 格式化、折叠浏览和路径提取，适合接口联调和日志排查。',
    status: 'planned',
    eyebrow: 'Planned'
  },
  {
    title: 'Regex Lab',
    slug: 'regex-lab',
    description: '为正则表达式提供样例匹配、替换预览和常见片段库，减少命令行来回试错。',
    status: 'planned',
    eyebrow: 'Planned'
  },
  {
    title: 'Color Tokens',
    slug: 'color-tokens',
    description: '整理品牌色、导出设计 token 和对比色差，作为 Orange Tools 的视觉辅助面板。',
    status: 'planned',
    eyebrow: 'Planned'
  }
]
