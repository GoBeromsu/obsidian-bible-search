import { requestUrl } from 'obsidian'

import { BIBLE_BOOKS } from '../../domain/book-map'
import { BibleSource, VerseData } from '../../types/index'
import { resilientFetch, FetchFn } from '../../utils/resilient-fetch'

const BROWSER_UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36'

export class BsKoreaScraper implements BibleSource {
  private readonly fetchFn: FetchFn

  constructor(fetchFn?: FetchFn) {
    this.fetchFn = fetchFn ?? (params => requestUrl(params))
  }

  async fetchChapter(versionCode: string, bookNr: number, chapter: number): Promise<VerseData[]> {
    const book = BIBLE_BOOKS.find(b => b.nr === bookNr)
    if (!book) throw new Error(`Unknown book number: ${bookNr}`)

    const url = `https://www.bskorea.or.kr/bible/korbibReadpage.php?version=${versionCode}&book=${book.bskCode}&chap=${chapter}`

    const response = await resilientFetch({
      url,
      fetchFn: this.fetchFn,
      headers: {
        'User-Agent': BROWSER_UA,
        'Referer': 'https://www.bskorea.or.kr/',
      },
      validateResponse: r => r.text.includes('tdBible1'),
    })

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

  return (clone.textContent ?? '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function parseVerses(html: string, chapter: number): VerseData[] {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const container = doc.querySelector('#tdBible1')
  if (!container) throw new Error('BSKorea response missing #tdBible1 — page structure may have changed')

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
