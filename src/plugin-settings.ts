export interface BibleSearchSettings {
  defaultVersion: string
  outputFormat: 'callout' | 'blockquote'
  calloutType: string
  showVerseNumbers: boolean
  cacheEnabled: boolean
  cacheTtlMinutes: number
}

export const DEFAULT_SETTINGS: BibleSearchSettings = {
  defaultVersion: 'GAE',
  outputFormat: 'callout',
  calloutType: 'bible',
  showVerseNumbers: true,
  cacheEnabled: true,
  cacheTtlMinutes: 30,
}
