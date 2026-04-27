import { diffArrays, diffLines, diffWordsWithSpace } from 'diff'

export type DiffTokenType = 'unchanged' | 'added' | 'removed'
export type DiffRowType = 'context' | 'added' | 'removed' | 'modified'

export interface DiffToken {
  type: DiffTokenType
  value: string
}

export interface DiffRow {
  id: string
  type: DiffRowType
  leftLineNumber: number | null
  rightLineNumber: number | null
  leftText: string
  rightText: string
  leftTokens: DiffToken[]
  rightTokens: DiffToken[]
}

export interface DiffSummary {
  added: number
  removed: number
  modified: number
  unchanged: number
}

export interface DiffResult {
  rows: DiffRow[]
  summary: DiffSummary
}

interface DiffCursor {
  leftLineNumber: number
  rightLineNumber: number
}

function normalizeLineEndings(input: string): string {
  return input.replace(/\r\n/g, '\n')
}

function splitDisplayLines(input: string): string[] {
  const normalized = normalizeLineEndings(input)

  if (!normalized) {
    return []
  }

  const lines = normalized.split('\n')

  if (lines.at(-1) === '') {
    lines.pop()
  }

  return lines
}

function createTokens(value: string, type: DiffTokenType): DiffToken[] {
  return value === '' ? [] : [{ type, value }]
}

function createInlineTokens(leftText: string, rightText: string): Pick<DiffRow, 'leftTokens' | 'rightTokens'> {
  const leftTokens: DiffToken[] = []
  const rightTokens: DiffToken[] = []

  for (const part of diffWordsWithSpace(leftText, rightText)) {
    if (part.added) {
      rightTokens.push({ type: 'added', value: part.value })
      continue
    }

    if (part.removed) {
      leftTokens.push({ type: 'removed', value: part.value })
      continue
    }

    leftTokens.push({ type: 'unchanged', value: part.value })
    rightTokens.push({ type: 'unchanged', value: part.value })
  }

  return {
    leftTokens,
    rightTokens
  }
}

function createRow(input: Omit<DiffRow, 'id'>): DiffRow {
  const leftMark = input.leftLineNumber ?? 'x'
  const rightMark = input.rightLineNumber ?? 'x'

  return {
    ...input,
    id: `${input.type}-${leftMark}-${rightMark}`
  }
}

function pushContextRow(rows: DiffRow[], summary: DiffSummary, cursor: DiffCursor, line: string): void {
  rows.push(createRow({
    type: 'context',
    leftLineNumber: cursor.leftLineNumber,
    rightLineNumber: cursor.rightLineNumber,
    leftText: line,
    rightText: line,
    leftTokens: createTokens(line, 'unchanged'),
    rightTokens: createTokens(line, 'unchanged')
  }))
  summary.unchanged += 1
  cursor.leftLineNumber += 1
  cursor.rightLineNumber += 1
}

function pushRemovedRow(rows: DiffRow[], summary: DiffSummary, cursor: DiffCursor, line: string): void {
  rows.push(createRow({
    type: 'removed',
    leftLineNumber: cursor.leftLineNumber,
    rightLineNumber: null,
    leftText: line,
    rightText: '',
    leftTokens: createTokens(line, 'removed'),
    rightTokens: []
  }))
  summary.removed += 1
  cursor.leftLineNumber += 1
}

function pushAddedRow(rows: DiffRow[], summary: DiffSummary, cursor: DiffCursor, line: string): void {
  rows.push(createRow({
    type: 'added',
    leftLineNumber: null,
    rightLineNumber: cursor.rightLineNumber,
    leftText: '',
    rightText: line,
    leftTokens: [],
    rightTokens: createTokens(line, 'added')
  }))
  summary.added += 1
  cursor.rightLineNumber += 1
}

function pushModifiedRow(rows: DiffRow[], summary: DiffSummary, cursor: DiffCursor, leftText: string, rightText: string): void {
  rows.push(createRow({
    type: 'modified',
    leftLineNumber: cursor.leftLineNumber,
    rightLineNumber: cursor.rightLineNumber,
    leftText,
    rightText,
    ...createInlineTokens(leftText, rightText)
  }))
  summary.modified += 1
  cursor.leftLineNumber += 1
  cursor.rightLineNumber += 1
}

function pushPairedRows(rows: DiffRow[], summary: DiffSummary, cursor: DiffCursor, removedValue: string, addedValue: string): void {
  const removedLines = splitDisplayLines(removedValue)
  const addedLines = splitDisplayLines(addedValue)
  const lineChanges = diffArrays(removedLines, addedLines)

  for (let index = 0; index < lineChanges.length; index += 1) {
    const change = lineChanges[index]

    if (!change.added && !change.removed) {
      for (const line of change.value) {
        pushContextRow(rows, summary, cursor, line)
      }
      continue
    }

    const nextChange = lineChanges[index + 1]
    const hasPairedChange = (change.removed && nextChange?.added) || (change.added && nextChange?.removed)

    if (hasPairedChange) {
      const removedChunk = change.removed ? change.value : nextChange.value
      const addedChunk = change.added ? change.value : nextChange.value
      const pairedCount = Math.min(removedChunk.length, addedChunk.length)

      for (let pairIndex = 0; pairIndex < pairedCount; pairIndex += 1) {
        pushModifiedRow(rows, summary, cursor, removedChunk[pairIndex], addedChunk[pairIndex])
      }

      for (const line of removedChunk.slice(pairedCount)) {
        pushRemovedRow(rows, summary, cursor, line)
      }

      for (const line of addedChunk.slice(pairedCount)) {
        pushAddedRow(rows, summary, cursor, line)
      }

      index += 1
      continue
    }

    if (change.removed) {
      for (const line of change.value) {
        pushRemovedRow(rows, summary, cursor, line)
      }
      continue
    }

    for (const line of change.value) {
      pushAddedRow(rows, summary, cursor, line)
    }
  }
}

export function buildGitDiff(before: string, after: string): DiffResult {
  const original = normalizeLineEndings(before)
  const revised = normalizeLineEndings(after)
  const summary: DiffSummary = {
    added: 0,
    removed: 0,
    modified: 0,
    unchanged: 0
  }

  const rows: DiffRow[] = []
  const cursor: DiffCursor = {
    leftLineNumber: 1,
    rightLineNumber: 1
  }
  const changes = diffLines(original, revised)

  for (let index = 0; index < changes.length; index += 1) {
    const change = changes[index]

    if (!change.added && !change.removed) {
      for (const line of splitDisplayLines(change.value)) {
        pushContextRow(rows, summary, cursor, line)
      }

      continue
    }

    const nextChange = changes[index + 1]
    const hasPairedChange = (change.removed && nextChange?.added) || (change.added && nextChange?.removed)

    if (hasPairedChange) {
      const removedChange = change.removed ? change : nextChange
      const addedChange = change.added ? change : nextChange
      pushPairedRows(rows, summary, cursor, removedChange.value, addedChange.value)

      index += 1
      continue
    }

    if (change.removed) {
      for (const line of splitDisplayLines(change.value)) {
        pushRemovedRow(rows, summary, cursor, line)
      }

      continue
    }

    if (change.added) {
      for (const line of splitDisplayLines(change.value)) {
        pushAddedRow(rows, summary, cursor, line)
      }
    }
  }

  return {
    rows,
    summary
  }
}

export const diffExample = {
  before: `export function formatUser(user) {
  return {
    id: user.id,
    name: user.name,
    role: 'guest',
    active: true
  }
}`,
  after: `export function formatUser(user) {
  return {
    id: user.id,
    displayName: user.name,
    role: 'admin',
    active: user.enabled,
    tags: ['orange-tools']
  }
}`
}
