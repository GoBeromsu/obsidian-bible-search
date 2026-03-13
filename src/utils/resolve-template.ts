import { DEFAULT_FORMAT_TEMPLATE } from '../plugin-settings'

export interface TemplateContext {
  bookKo: string
  bookEn: string
  chapter: string
  range: string
  verses: string[]
  version: string
  calloutType: string
}

const VERSES_TOKEN = '{verses}'
const SCALAR_TOKENS = ['bookKo', 'bookEn', 'chapter', 'range', 'version', 'calloutType'] as const

/**
 * Resolve a user-configurable template string into final output.
 *
 * Scalar tokens (`{bookKo}`, `{bookEn}`, `{chapter}`, `{range}`, `{version}`,
 * `{calloutType}`) are replaced with their corresponding context values.
 * `{verses}` is special: `context.verses` is an array of pre-formatted lines,
 * and each line inherits both the prefix and suffix from its template line.
 * e.g. `> {verses} |` — each verse gets `> ` prepended and ` |` appended.
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
    const tokenStart = line.indexOf(VERSES_TOKEN)
    if (tokenStart >= 0) {
      const prefix = replaceScalars(line.slice(0, tokenStart), context)
      const suffix = replaceScalars(line.slice(tokenStart + VERSES_TOKEN.length), context)

      for (const verseLine of context.verses) {
        result.push(prefix + verseLine + suffix)
      }
    } else {
      result.push(replaceScalars(line, context))
    }
  }

  return result.join('\n')
}

function replaceScalars(text: string, ctx: TemplateContext): string {
  let result = text
  for (const key of SCALAR_TOKENS) {
    result = result.split(`{${key}}`).join(ctx[key])
  }
  return result
}
