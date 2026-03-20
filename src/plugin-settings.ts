export const DEFAULT_FORMAT_TEMPLATE =
  '> [[{bookEn} {chapter}]]:{range}\n> {versesKo}\n>\n> {versesEn}'

export interface BibleSearchSettings {
  defaultVersion: string
  koreanVersion: string
  englishVersion: string
  formatTemplate: string
  calloutType: string
  showVerseNumbers: boolean
  cacheEnabled: boolean
  cacheTtlMinutes: number
  plugin_notices: { muted: Record<string, boolean> }
  [key: string]: unknown
}

export const DEFAULT_SETTINGS: BibleSearchSettings = {
  defaultVersion: 'GAE',
  koreanVersion: 'GAE',
  englishVersion: 'ESV',
  formatTemplate: DEFAULT_FORMAT_TEMPLATE,
  calloutType: 'bible',
  showVerseNumbers: true,
  cacheEnabled: true,
  cacheTtlMinutes: 30,
  plugin_notices: { muted: {} },
}
