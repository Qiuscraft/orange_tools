import { describe, expect, it } from 'vitest'

import { buildJsonDiff, parseJsonNodePaths } from '../app/utils/jsonDiff'

describe('buildJsonDiff', () => {
  it('compares normalized json and ignores formatting noise', () => {
    const result = buildJsonDiff('{"b":2,"a":1}', '{\n  "a": 1,\n  "b": 2\n}')

    expect(result.ok).toBe(true)

    if (!result.ok) {
      throw new Error('expected valid json diff result')
    }

    expect(result.diff.summary).toEqual({
      added: 0,
      removed: 0,
      modified: 0,
      unchanged: 4
    })
    expect(result.formattedLeft).toBe(result.formattedRight)
  })

  it('keeps array order but sorts object keys recursively', () => {
    const result = buildJsonDiff(
      '{"payload":{"z":1,"a":2},"items":[{"b":2,"a":1}]}',
      '{"items":[{"a":1,"b":3}],"payload":{"a":2,"z":1}}'
    )

    expect(result.ok).toBe(true)

    if (!result.ok) {
      throw new Error('expected valid json diff result')
    }

    expect(result.formattedLeft).toContain('"items"')
    expect(result.formattedLeft).toContain('"payload"')
    expect(result.diff.summary.modified).toBe(1)
  })

  it('ignores list order for configured node path', () => {
    const result = buildJsonDiff(
      '{"modules":[{"id":2,"name":"json-diff"},{"id":1,"name":"git-diff"}]}',
      '{"modules":[{"id":1,"name":"git-diff"},{"id":2,"name":"json-diff"}]}',
      { unorderedNodePaths: ['modules'] }
    )

    expect(result.ok).toBe(true)

    if (!result.ok) {
      throw new Error('expected valid json diff result')
    }

    expect(result.formattedLeft).toBe(result.formattedRight)
    expect(result.diff.summary.added).toBe(0)
    expect(result.diff.summary.removed).toBe(0)
    expect(result.diff.summary.modified).toBe(0)
  })

  it('still treats list order as meaningful when node path is not configured', () => {
    const result = buildJsonDiff(
      '{"modules":[{"id":2,"name":"json-diff"},{"id":1,"name":"git-diff"}]}',
      '{"modules":[{"id":1,"name":"git-diff"},{"id":2,"name":"json-diff"}]}'
    )

    expect(result.ok).toBe(true)

    if (!result.ok) {
      throw new Error('expected valid json diff result')
    }

    expect(result.formattedLeft).not.toBe(result.formattedRight)
    expect(result.diff.summary.added + result.diff.summary.removed + result.diff.summary.modified).toBeGreaterThan(0)
  })

  it('parses node paths from comma or newline separated input', () => {
    expect(parseJsonNodePaths('modules, payload.items\n modules')).toEqual(['modules', 'payload.items'])
  })

  it('returns validation error when configured node is not a list', () => {
    const result = buildJsonDiff(
      '{"modules":{"id":1}}',
      '{"modules":[{"id":1}]}',
      { unorderedNodePaths: ['modules'] }
    )

    expect(result.ok).toBe(false)

    if (result.ok) {
      throw new Error('expected invalid json diff result')
    }

    expect(result.leftError).toBe('左侧 节点 modules 不是 list 类型')
    expect(result.rightError).toBeNull()
  })

  it('returns side-specific validation errors for invalid json', () => {
    const result = buildJsonDiff('{"a":1', '{"a":1}')

    expect(result.ok).toBe(false)

    if (result.ok) {
      throw new Error('expected invalid json diff result')
    }

    expect(result.leftError).toBe('左侧 JSON 格式无效')
    expect(result.rightError).toBeNull()
  })

  it('rejects empty input', () => {
    const result = buildJsonDiff('', '{}')

    expect(result.ok).toBe(false)

    if (result.ok) {
      throw new Error('expected invalid json diff result')
    }

    expect(result.leftError).toBe('左侧 JSON 不能为空')
    expect(result.rightError).toBeNull()
  })
})
