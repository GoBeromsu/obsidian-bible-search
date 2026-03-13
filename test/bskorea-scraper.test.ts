import { readFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import { JSDOM } from 'jsdom'
import { beforeAll, describe, expect, it } from 'vitest'

import { parseVerses } from '../src/sources/bskorea-scraper'
import type { VerseData } from '../src/sources/types'

const dom = new JSDOM('')
// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(globalThis as any).DOMParser = dom.window.DOMParser

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const fixturePath = path.resolve(__dirname, 'fixtures/bskorea-genesis-1.html')

let verses: VerseData[]

beforeAll(() => {
  const fixture = readFileSync(fixturePath, 'utf-8')
  const wrappedHtml = `<html><body>${fixture}</body></html>`
  verses = parseVerses(wrappedHtml, 1)
})

describe('parseVerses — Genesis 1 (bskorea fixture)', () => {
  it('returns 31 verses', () => {
    expect(verses).toHaveLength(31)
  })

  it('verse 1 contains expected text', () => {
    const v1 = verses.find(v => v.verse === 1)
    expect(v1).toBeDefined()
    expect(v1?.chapter).toBe(1)
    expect(v1?.verse).toBe(1)
    expect(v1?.text).toContain('태초에 하나님이 천지를 창조하시니라')
  })

  it('verse 31 contains expected text', () => {
    const v31 = verses.find(v => v.verse === 31)
    expect(v31).toBeDefined()
    expect(v31?.text).toContain('심히 좋았더라')
  })

  it('no footnote markers in verse texts', () => {
    for (const v of verses) {
      // Footnote markers look like "1)" "2)" "3)"
      expect(v.text).not.toMatch(/\d+\)/)
    }
  })

  it('no HTML tags in verse texts', () => {
    for (const v of verses) {
      expect(v.text).not.toMatch(/<[^>]+>/)
    }
  })

  it('verses are sorted by verse number', () => {
    for (let i = 1; i < verses.length; i++) {
      expect(verses[i].verse).toBeGreaterThan(verses[i - 1].verse)
    }
  })

  it('all verses have chapter set to 1', () => {
    for (const v of verses) {
      expect(v.chapter).toBe(1)
    }
  })
})
