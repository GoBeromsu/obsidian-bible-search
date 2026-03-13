import { VerseData } from '../sources/types'
import { BibleSearchSettings } from '../plugin-settings'
import { ParsedReference } from './reference-parser'

function buildRangeLabel(ref: ParsedReference): string {
  if (ref.verseStart === ref.verseEnd) {
    return `${ref.chapter}:${ref.verseStart}`
  }
  return `${ref.chapter}:${ref.verseStart}-${ref.verseEnd}`
}

function buildTitle(ref: ParsedReference): string {
  return `${ref.bookKo} (${ref.bookEn})`
}

function buildVerseLines(verses: VerseData[], settings: BibleSearchSettings, ref: ParsedReference): string[] {
  const isSingle = ref.verseStart === ref.verseEnd
  return verses.map((v) => {
    const number = !isSingle && settings.showVerseNumbers ? `**${v.verse}** ` : ''
    return `> ${number}${v.text}`
  })
}

export function formatVerses(
  verses: VerseData[],
  ref: ParsedReference,
  settings: BibleSearchSettings,
): string {
  const title = buildTitle(ref)
  const rangeLabel = buildRangeLabel(ref)
  const lines = buildVerseLines(verses, settings, ref)

  if (settings.outputFormat === 'callout') {
    const header = `> [!${settings.calloutType}] ${title} ${rangeLabel}`
    return [header, ...lines].join('\n')
  }

  const citation = `> — ${title} ${rangeLabel}`
  return [...lines, citation].join('\n')
}
