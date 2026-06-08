import { buildGitDiff, type DiffResult } from './gitDiff'

export interface JsonDiffOptions {
  unorderedNodePaths?: string[]
}

export interface JsonDiffSuccess {
  ok: true
  formattedLeft: string
  formattedRight: string
  diff: DiffResult
}

export interface JsonDiffFailure {
  ok: false
  leftError: string | null
  rightError: string | null
}

export type JsonDiffBuildResult = JsonDiffSuccess | JsonDiffFailure

type JsonValue = null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue }

type JsonPathSegment = string | number

interface JsonPathRule {
  raw: string
  normalized: string
  segments: JsonPathSegment[]
}

function createPathKey(path: JsonPathSegment[]): string {
  return path.reduce((result, segment) => {
    if (typeof segment === 'number') {
      return `${result}[${segment}]`
    }

    return result ? `${result}.${segment}` : segment
  }, '')
}

function parsePathSegment(rawSegment: string): JsonPathSegment[] {
  const segments: JsonPathSegment[] = []
  const matcher = /([^.[\]]+)|(\[(\d+)\])/g

  for (const match of rawSegment.matchAll(matcher)) {
    if (match[1]) {
      segments.push(match[1])
      continue
    }

    if (match[3]) {
      segments.push(Number(match[3]))
    }
  }

  return segments
}

function createPathRules(paths: string[]): JsonPathRule[] {
  const rules: JsonPathRule[] = []

  for (const path of paths) {
    const segments = parsePathSegment(path)
    const normalized = createPathKey(segments)

    if (!normalized) {
      continue
    }

    rules.push({
      raw: path,
      normalized,
      segments
    })
  }

  return rules
}

export function parseJsonNodePaths(input: string): string[] {
  return Array.from(new Set(
    input
      .split(/[\n,]/)
      .map(item => item.trim())
      .filter(Boolean)
  ))
}

function createStableSortKey(value: JsonValue): string {
  return JSON.stringify(value)
}

function resolveJsonPathValue(root: JsonValue, segments: JsonPathSegment[]): { exists: boolean, value?: JsonValue } {
  let current: JsonValue = root

  for (const segment of segments) {
    if (typeof segment === 'number') {
      if (!Array.isArray(current) || segment < 0 || segment >= current.length) {
        return { exists: false }
      }

      current = current[segment]
      continue
    }

    if (!current || Array.isArray(current) || typeof current !== 'object' || !(segment in current)) {
      return { exists: false }
    }

    current = current[segment]
  }

  return {
    exists: true,
    value: current
  }
}

function validateUnorderedNodePaths(root: JsonValue, sideLabel: '左侧' | '右侧', rules: JsonPathRule[]): string | null {
  for (const rule of rules) {
    const resolved = resolveJsonPathValue(root, rule.segments)

    if (!resolved.exists) {
      continue
    }

    if (!Array.isArray(resolved.value)) {
      return `${sideLabel} 节点 ${rule.raw} 不是 list 类型`
    }
  }

  return null
}

function sortJsonValue(value: JsonValue, unorderedPathSet: Set<string>, currentPath: JsonPathSegment[] = []): JsonValue {
  if (Array.isArray(value)) {
    const normalizedItems = value.map((item, index) => sortJsonValue(item, unorderedPathSet, [...currentPath, index]))

    if (unorderedPathSet.has(createPathKey(currentPath))) {
      return [...normalizedItems].sort((left, right) => createStableSortKey(left).localeCompare(createStableSortKey(right)))
    }

    return normalizedItems
  }

  if (value && typeof value === 'object') {
    return Object.keys(value)
      .sort((left, right) => left.localeCompare(right))
      .reduce<{ [key: string]: JsonValue }>((result, key) => {
        result[key] = sortJsonValue(value[key], unorderedPathSet, [...currentPath, key])
        return result
      }, {})
  }

  return value
}

function formatSingleJson(input: string, sideLabel: '左侧' | '右侧', options: JsonDiffOptions): { formatted: string | null, error: string | null } {
  if (!input.trim()) {
    return {
      formatted: null,
      error: `${sideLabel} JSON 不能为空`
    }
  }

  try {
    const parsed = JSON.parse(input) as JsonValue
    const pathRules = createPathRules(options.unorderedNodePaths ?? [])
    const validationError = validateUnorderedNodePaths(parsed, sideLabel, pathRules)

    if (validationError) {
      return {
        formatted: null,
        error: validationError
      }
    }

    const unorderedPathSet = new Set(pathRules.map(rule => rule.normalized))

    return {
      formatted: JSON.stringify(sortJsonValue(parsed, unorderedPathSet), null, 2),
      error: null
    }
  }
  catch {
    return {
      formatted: null,
      error: `${sideLabel} JSON 格式无效`
    }
  }
}

export function buildJsonDiff(leftInput: string, rightInput: string, options: JsonDiffOptions = {}): JsonDiffBuildResult {
  const leftResult = formatSingleJson(leftInput, '左侧', options)
  const rightResult = formatSingleJson(rightInput, '右侧', options)

  if (leftResult.error || rightResult.error || !leftResult.formatted || !rightResult.formatted) {
    return {
      ok: false,
      leftError: leftResult.error,
      rightError: rightResult.error
    }
  }

  return {
    ok: true,
    formattedLeft: leftResult.formatted,
    formattedRight: rightResult.formatted,
    diff: buildGitDiff(leftResult.formatted, rightResult.formatted)
  }
}

export const jsonDiffExample = {
  before: `{
  "name": "orange-tools",
  "version": 1,
  "features": {
    "gitDiff": true,
    "jsonDiff": false
  },
  "tags": ["diff", "local"],
  "modules": [
    { "id": 2, "name": "json-diff" },
    { "id": 1, "name": "git-diff" }
  ]
}`,
  after: `{
  "version": 2,
  "name": "orange-tools",
  "features": {
    "jsonDiff": true,
    "gitDiff": true,
    "share": false
  },
  "tags": ["diff", "local", "json"],
  "modules": [
    { "id": 1, "name": "git-diff" },
    { "id": 2, "name": "json-diff" }
  ],
  "theme": "green"
}`,
  unorderedPaths: 'modules'
}
