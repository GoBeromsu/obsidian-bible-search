import { describe, expect, it } from 'vitest'

import { BIBLE_BOOKS } from '../src/domain/book-map'
import { buildParsedReference, getInputValueForSuggestion } from '../src/ui/bible-search-selection'

const GENESIS = BIBLE_BOOKS.find(book => book.ko === '창세기')!
const JUDE = BIBLE_BOOKS.find(book => book.ko === '유다서')!

describe('bible-search-selection', () => {
  it('builds the next input value for book and chapter suggestions', () => {
    expect(getInputValueForSuggestion({ type: 'book', book: GENESIS })).toBe('창세기 ')
    expect(getInputValueForSuggestion({ type: 'book', book: JUDE })).toBe('유다서 1:')
    expect(getInputValueForSuggestion({ type: 'chapter', book: GENESIS, chapter: 3 })).toBe('창세기 3:')
  })

  it('returns null for final suggestions that should be inserted', () => {
    expect(
      getInputValueForSuggestion({
        type: 'verse',
        book: GENESIS,
        chapter: 1,
        verse: 1,
        text: '태초에',
      }),
    ).toBeNull()
  })

  it('builds parsed references for verse and range suggestions', () => {
    expect(
      buildParsedReference({
        type: 'verse',
        book: GENESIS,
        chapter: 1,
        verse: 2,
        text: '본문',
      }),
    ).toMatchObject({ chapter: 1, verseStart: 2, verseEnd: 2, bookKo: '창세기' })

    expect(
      buildParsedReference({
        type: 'range',
        book: GENESIS,
        chapter: 1,
        verseStart: 2,
        verseEnd: 4,
        preview: '본문',
      }),
    ).toMatchObject({ chapter: 1, verseStart: 2, verseEnd: 4, bookEn: 'Genesis' })
  })
})
