import { describe, expect, it } from 'vitest'

import { buildGitDiff } from '../app/utils/gitDiff'

describe('buildGitDiff', () => {
  it('returns context rows for identical content', () => {
    const result = buildGitDiff('alpha\nbeta', 'alpha\nbeta')

    expect(result.summary).toEqual({
      added: 0,
      removed: 0,
      modified: 0,
      unchanged: 2
    })
    expect(result.rows.map(row => row.type)).toEqual(['context', 'context'])
  })

  it('detects pure additions and removals', () => {
    const removed = buildGitDiff('alpha\nbeta', '')
    const added = buildGitDiff('', 'alpha\nbeta')

    expect(removed.summary.removed).toBe(2)
    expect(removed.rows.every(row => row.type === 'removed')).toBe(true)
    expect(added.summary.added).toBe(2)
    expect(added.rows.every(row => row.type === 'added')).toBe(true)
  })

  it('marks changed lines as modified and keeps line numbers aligned', () => {
    const result = buildGitDiff('const role = "guest"', 'const role = "admin"')

    expect(result.summary.modified).toBe(1)
    expect(result.rows).toHaveLength(1)
    expect(result.rows[0]).toMatchObject({
      type: 'modified',
      leftLineNumber: 1,
      rightLineNumber: 1
    })
    expect(result.rows[0].leftTokens.some(token => token.type === 'removed')).toBe(true)
    expect(result.rows[0].rightTokens.some(token => token.type === 'added')).toBe(true)
  })

  it('handles uneven replace blocks with aligned placeholders', () => {
    const result = buildGitDiff('a\nb\nc', 'a\nb updated\nc\nd')

    expect(result.rows.map(row => row.type)).toEqual(['context', 'modified', 'context', 'added'])
    expect(result.rows[3]).toMatchObject({
      type: 'added',
      leftLineNumber: null,
      rightLineNumber: 4
    })
  })

  it('normalizes windows line endings', () => {
    const result = buildGitDiff('alpha\r\nbeta', 'alpha\nbeta\ngamma')

    expect(result.rows.map(row => row.type)).toEqual(['context', 'context', 'added'])
    expect(result.summary.added).toBe(1)
  })
})
