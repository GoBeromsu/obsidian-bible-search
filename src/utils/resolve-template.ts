import { DEFAULT_FORMAT_TEMPLATE } from '../domain/settings'

export interface TemplateContext {
  bookKo: string
  bookEn: string
  chapter: string
  range: string
  verses: string[]
  version: string
  calloutType: string
  versesKo?: string[]
  versesEn?: string[]
  versionKo?: string
  versionEn?: string
}

interface ArrayTokenDef {
  token: string
  key: 'versesKo' | 'versesEn' | 'verses'
}

const ARRAY_TOKENS: ArrayTokenDef[] = [
  { token: '{versesKo}', key: 'versesKo' },
  { token: '{versesEn}', key: 'versesEn' },
  { token: '{verses}', key: 'verses' },
]

const SCALAR_TOKENS = [
  'bookKo', 'bookEn', 'chapter', 'range',
  'version', 'calloutType', 'versionKo', 'versionEn',
] as const

export interface RequiredFetches {
  needsDefault: boolean
  needsKorean: boolean
  needsEnglish: boolean
}

const TOKEN_KEY_TO_FETCH: Record<ArrayTokenDef['key'], keyof RequiredFetches> = {
  verses: 'needsDefault',
  versesKo: 'needsKorean',
  versesEn: 'needsEnglish',
}

/**
 * Detect which verse fetches a template requires based on its tokens.
 * Iterates longest-first (matching ARRAY_TOKENS order) and strips matched
 * tokens so `{verses}` is not falsely detected inside `{versesKo}`.
 */
export function detectRequiredFetches(template: string): RequiredFetches {
  const result: RequiredFetches = { needsDefault: false, needsKorean: false, needsEnglish: false }
  let remaining = template
  for (const def of ARRAY_TOKENS) {
    if (remaining.includes(def.token)) {
      result[TOKEN_KEY_TO_FETCH[def.key]] = true
      remaining = remaining.split(def.token).join('')
    }
  }
  return result
}

/**
 * Resolve a user-configurable template string into final output.
 *
 * Scalar tokens (`{bookKo}`, `{bookEn}`, `{chapter}`, `{range}`, `{version}`,
 * `{calloutType}`, `{versionKo}`, `{versionEn}`) are replaced with their
 * corresponding context values.
 *
 * Array tokens (`{versesKo}`, `{versesEn}`, `{verses}`) expand into multiple
 * lines inheriting the prefix and suffix from their template line. If the
 * context array for a token is undefined, the line is silently skipped.
 * Longer tokens are checked first to avoid partial matches.
 *
 * Falls back to `DEFAULT_FORMAT_TEMPLATE` if the template is empty/whitespace.
 * Unrecognized tokens (e.g. `{foo}`) are left as-is in the output.
 */
export function resolveTemplate(
  template: string,
  context: TemplateContext,
): string {
  const effective = template.trim() || DEFAULT_FORMAT_TEMPLATE

  const lines = effective.split('\n')
  const result: string[] = []

  for (const line of lines) {
    const matched = findArrayToken(line)
    if (matched) {
      const { def, index } = matched
      const arr = context[def.key]
      if (arr === undefined) continue

      const prefix = replaceScalars(line.slice(0, index), context)
      const suffix = replaceScalars(line.slice(index + def.token.length), context)

      for (const verseLine of arr) {
        result.push(prefix + verseLine + suffix)
      }
    } else {
      result.push(replaceScalars(line, context))
    }
  }

  return result.join('\n')
}

function findArrayToken(line: string): { def: ArrayTokenDef; index: number } | null {
  for (const def of ARRAY_TOKENS) {
    const idx = line.indexOf(def.token)
    if (idx >= 0) return { def, index: idx }
  }
  return null
}

function replaceScalars(text: string, ctx: TemplateContext): string {
  if (!text.includes('{')) return text
  let result = text
  for (const key of SCALAR_TOKENS) {
    const value = ctx[key]
    if (value !== undefined) {
      result = result.split(`{${key}}`).join(value)
    }
  }
  return result
}
