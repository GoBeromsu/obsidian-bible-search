import { requestUrl } from 'obsidian'

import { BIBLE_BOOKS } from '../data/book-map'
import { BibleSource, VerseData } from './types'

export class BsKoreaScraper implements BibleSource {
  async fetchChapter(versionCode: string, bookNr: number, chapter: number): Promise<VerseData[]> {
    const book = BIBLE_BOOKS.find(b => b.nr === bookNr)
    if (!book) throw new Error(`Unknown book number: ${bookNr}`)

    const url = `https://www.bskorea.or.kr/bible/korbibReadpage.php?version=${versionCode}&book=${book.bskCode}&chap=${chapter}`

    const response = await requestUrl({ url, method: 'GET', throw: false })
    if (response.status !== 200) {
      throw new Error(`Failed to fetch from bskorea: HTTP ${response.status}`)
    }

    return parseVerses(response.text, chapter)
  }
}

function extractVerseNumber(numberSpan: Element): number {
  const raw = numberSpan.textContent ?? ''
  // textContent includes nbsp characters — strip to get the digit(s)
  const match = raw.match(/\d+/)
  return match ? parseInt(match[0], 10) : 0
}

const NOISE_SELECTORS = [
  'span.number',
  'a.comment', 'a[class="comment"]',
  'div.D2', 'div[class="D2"]', 'div[class~="D2"]',
  'font.smallTitle',
].join(', ')

function cleanVerseText(parentSpan: Element): string {
  const clone = parentSpan.cloneNode(true) as Element

  for (const el of Array.from(clone.querySelectorAll(NOISE_SELECTORS))) {
    el.remove()
  }

  return (clone.textContent ?? '').trim()
}

export function parseVerses(html: string, chapter: number): VerseData[] {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const container = doc.querySelector('#tdBible1')
  if (!container) return []

  const numberSpans = Array.from(container.querySelectorAll('span.number'))
  const verses: VerseData[] = []

  for (const numberSpan of numberSpans) {
    const verseNr = extractVerseNumber(numberSpan)
    if (verseNr === 0) continue

    const parentSpan = numberSpan.parentElement
    if (!parentSpan) continue

    const text = cleanVerseText(parentSpan)
    if (!text) continue

    verses.push({ chapter, verse: verseNr, text })
  }

  return verses.sort((a, b) => a.verse - b.verse)
}
