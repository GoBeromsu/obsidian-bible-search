import { requestUrl } from 'obsidian'
import { BibleSource, VerseData } from '../../types/index'
import { resilientFetch, FetchFn } from '../../utils/resilient-fetch'

export class BollsApi implements BibleSource {
  private readonly fetchFn: FetchFn

  constructor(fetchFn?: FetchFn) {
    this.fetchFn = fetchFn ?? (params => requestUrl(params))
  }

  async fetchChapter(versionCode: string, bookNr: number, chapter: number): Promise<VerseData[]> {
    const url = `https://bolls.life/get-chapter/${versionCode}/${bookNr}/${chapter}/`
    const response = await resilientFetch({
      url,
      fetchFn: this.fetchFn,
      validateResponse: r => Array.isArray(r.json) && r.json.length > 0 && 'verse' in r.json[0],
    })
    return parseBollsResponse(response.json as Array<{ pk: number; verse: number; text: string }>, chapter)
  }
}

export function parseBollsResponse(
  data: Array<{ pk: number; verse: number; text: string }>,
  chapter: number,
): VerseData[] {
  return data.map(entry => ({
    chapter,
    verse: entry.verse,
    text: stripBollsTags(entry.text),
  }))
}

export function stripBollsTags(text: string): string {
  return text
    .replace(/<S>\d+<\/S>/g, '')
    .replace(/<sup>.*?<\/sup>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}
