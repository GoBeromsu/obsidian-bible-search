import { VerseCache } from '../domain/verse-cache'
import { VerseData } from '../types/index'
import { getSource, getSourceVersionCode } from './sources/source-registry'

export async function fetchChapterVerses(
  version: string,
  bookNr: number,
  chapter: number,
  cache: VerseCache,
  cacheEnabled: boolean,
): Promise<VerseData[]> {
  const sourceVersion = getSourceVersionCode(version)
  const source = getSource(version)

  if (cacheEnabled) {
    const cached = cache.get(version, bookNr, chapter)
    if (cached) return cached
  }

  const verses = await source.fetchChapter(sourceVersion, bookNr, chapter)
  if (cacheEnabled && verses.length > 0) {
    cache.set(version, bookNr, chapter, verses)
  }
  return verses
}
