export const DEFAULT_FORMAT_TEMPLATE =
  '> [!{calloutType}] {bookKo} ({bookEn}) {range}\n> {verses}'

export interface BibleSearchSettings {
  defaultVersion: string
  formatTemplate: string
  calloutType: string
  showVerseNumbers: boolean
  cacheEnabled: boolean
  cacheTtlMinutes: number
}

export const DEFAULT_SETTINGS: BibleSearchSettings = {
  defaultVersion: 'GAE',
  formatTemplate: DEFAULT_FORMAT_TEMPLATE,
  calloutType: 'bible',
  showVerseNumbers: true,
  cacheEnabled: true,
  cacheTtlMinutes: 30,
}
