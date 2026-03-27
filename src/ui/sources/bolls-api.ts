import { requestUrl } from 'obsidian'
import { BibleSource, VerseData } from '../../types/index'

export class BollsApi implements BibleSource {
  async fetchChapter(versionCode: string, bookNr: number, chapter: number): Promise<VerseData[]> {
    const url = `https://bolls.life/get-chapter/${versionCode}/${bookNr}/${chapter}/`
    const response = await requestUrl({ url, method: 'GET', throw: false })
    if (response.status !== 200) {
      throw new Error(`Failed to fetch from bolls.life: HTTP ${response.status}`)
    }
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
