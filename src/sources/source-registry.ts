import { BibleSource } from './types'
import { BsKoreaScraper } from './bskorea-scraper'
import { BollsApi } from './bolls-api'

const bskorea = new BsKoreaScraper()
const bolls = new BollsApi()

const SOURCE_MAP: Record<string, BibleSource> = {
  GAE: bskorea,
  KRV: bskorea,
  NIR: bskorea,
  ESV: bolls,
  KJV: bolls,
}

const BSKOREA_VERSION_MAP: Record<string, string> = {
  GAE: 'GAE',
  KRV: 'HAN',
  NIR: 'SAENEW',
}

export function getSource(version: string): BibleSource {
  const source = SOURCE_MAP[version]
  if (!source) throw new Error(`Unsupported Bible version: ${version}`)
  return source
}

export function getSourceVersionCode(version: string): string {
  return BSKOREA_VERSION_MAP[version] ?? version
}

export const SUPPORTED_VERSIONS = [
  { code: 'GAE', label: '개역개정 (GAE)' },
  { code: 'KRV', label: '개역한글 (KRV)' },
  { code: 'NIR', label: '새번역 (NIR)' },
  { code: 'ESV', label: 'ESV' },
  { code: 'KJV', label: 'KJV' },
]
