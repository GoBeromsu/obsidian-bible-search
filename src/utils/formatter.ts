import { VerseData } from '../sources/types'
import { BibleSearchSettings } from '../plugin-settings'
import { ParsedReference } from './reference-parser'
import { resolveTemplate, TemplateContext } from './resolve-template'

function buildRangeLabel(ref: ParsedReference): string {
  if (ref.verseStart === ref.verseEnd) {
    return `${ref.chapter}:${ref.verseStart}`
  }
  return `${ref.chapter}:${ref.verseStart}-${ref.verseEnd}`
}

export function formatVerses(
  verses: VerseData[],
  ref: ParsedReference,
  settings: BibleSearchSettings,
): string {
  const isSingle = ref.verseStart === ref.verseEnd
  const verseLines = verses.map((v) => {
    const number = !isSingle && settings.showVerseNumbers ? `**${v.verse}** ` : ''
    return `${number}${v.text}`
  })

  const context: TemplateContext = {
    bookKo: ref.bookKo,
    bookEn: ref.bookEn,
    chapter: String(ref.chapter),
    range: buildRangeLabel(ref),
    verses: verseLines,
    version: settings.defaultVersion,
    calloutType: settings.calloutType,
  }

  return resolveTemplate(settings.formatTemplate, context)
}
