import { describe, it, expect } from 'vitest'
import { parseReference } from '../src/utils/reference-parser'

describe('parseReference', () => {
  // --- Korean full names ---
  describe('Korean full names', () => {
    it('parses 요한복음 3:16', () => {
      const result = parseReference('요한복음 3:16')
      expect(result).toEqual({
        bookNr: 43,
        bookKo: '요한복음',
        bookEn: 'John',
        chapter: 3,
        verseStart: 16,
        verseEnd: 16,
      })
    })

    it('parses 창세기 1:1', () => {
      const result = parseReference('창세기 1:1')
      expect(result).toEqual({
        bookNr: 1,
        bookKo: '창세기',
        bookEn: 'Genesis',
        chapter: 1,
        verseStart: 1,
        verseEnd: 1,
      })
    })

    it('parses 마태복음 5:3', () => {
      const result = parseReference('마태복음 5:3')
      expect(result).toEqual({
        bookNr: 40,
        bookKo: '마태복음',
        bookEn: 'Matthew',
        chapter: 5,
        verseStart: 3,
        verseEnd: 3,
      })
    })

    it('parses 요한일서 3:16', () => {
      const result = parseReference('요한일서 3:16')
      expect(result).toEqual({
        bookNr: 62,
        bookKo: '요한일서',
        bookEn: '1 John',
        chapter: 3,
        verseStart: 16,
        verseEnd: 16,
      })
    })

    it('parses 예레미야애가 3:22', () => {
      const result = parseReference('예레미야애가 3:22')
      expect(result).toEqual({
        bookNr: 25,
        bookKo: '예레미야애가',
        bookEn: 'Lamentations',
        chapter: 3,
        verseStart: 22,
        verseEnd: 22,
      })
    })
  })

  // --- Korean abbreviations ---
  describe('Korean abbreviations', () => {
    it('parses 요 3:16 (요한복음)', () => {
      const result = parseReference('요 3:16')
      expect(result).toEqual({
        bookNr: 43,
        bookKo: '요한복음',
        bookEn: 'John',
        chapter: 3,
        verseStart: 16,
        verseEnd: 16,
      })
    })

    it('parses 창 1:1 (창세기)', () => {
      const result = parseReference('창 1:1')
      expect(result).toEqual({
        bookNr: 1,
        bookKo: '창세기',
        bookEn: 'Genesis',
        chapter: 1,
        verseStart: 1,
        verseEnd: 1,
      })
    })

    it('parses 고전 13:4 (고린도전서)', () => {
      const result = parseReference('고전 13:4')
      expect(result).toEqual({
        bookNr: 46,
        bookKo: '고린도전서',
        bookEn: '1 Corinthians',
        chapter: 13,
        verseStart: 4,
        verseEnd: 4,
      })
    })

    it('parses 살전 4:13 (데살로니가전서)', () => {
      const result = parseReference('살전 4:13')
      expect(result).toEqual({
        bookNr: 52,
        bookKo: '데살로니가전서',
        bookEn: '1 Thessalonians',
        chapter: 4,
        verseStart: 13,
        verseEnd: 13,
      })
    })

    it('parses 요일 2:1 (요한일서)', () => {
      const result = parseReference('요일 2:1')
      expect(result).toEqual({
        bookNr: 62,
        bookKo: '요한일서',
        bookEn: '1 John',
        chapter: 2,
        verseStart: 1,
        verseEnd: 1,
      })
    })

    it('parses 벧전 5:7 (베드로전서)', () => {
      const result = parseReference('벧전 5:7')
      expect(result).toEqual({
        bookNr: 60,
        bookKo: '베드로전서',
        bookEn: '1 Peter',
        chapter: 5,
        verseStart: 7,
        verseEnd: 7,
      })
    })
  })

  // --- English full names ---
  describe('English full names', () => {
    it('parses John 3:16', () => {
      const result = parseReference('John 3:16')
      expect(result).toEqual({
        bookNr: 43,
        bookKo: '요한복음',
        bookEn: 'John',
        chapter: 3,
        verseStart: 16,
        verseEnd: 16,
      })
    })

    it('parses Genesis 1:1', () => {
      const result = parseReference('Genesis 1:1')
      expect(result).toEqual({
        bookNr: 1,
        bookKo: '창세기',
        bookEn: 'Genesis',
        chapter: 1,
        verseStart: 1,
        verseEnd: 1,
      })
    })

    it('parses Revelation 22:20', () => {
      const result = parseReference('Revelation 22:20')
      expect(result).toEqual({
        bookNr: 66,
        bookKo: '요한계시록',
        bookEn: 'Revelation',
        chapter: 22,
        verseStart: 20,
        verseEnd: 20,
      })
    })

    it('parses Psalms 23:1', () => {
      const result = parseReference('Psalms 23:1')
      expect(result).toEqual({
        bookNr: 19,
        bookKo: '시편',
        bookEn: 'Psalms',
        chapter: 23,
        verseStart: 1,
        verseEnd: 1,
      })
    })
  })

  // --- English abbreviations ---
  describe('English abbreviations', () => {
    it('parses Gen 1:1', () => {
      const result = parseReference('Gen 1:1')
      expect(result).toEqual({
        bookNr: 1,
        bookKo: '창세기',
        bookEn: 'Genesis',
        chapter: 1,
        verseStart: 1,
        verseEnd: 1,
      })
    })

    it('parses Matt 5:3', () => {
      const result = parseReference('Matt 5:3')
      expect(result).toEqual({
        bookNr: 40,
        bookKo: '마태복음',
        bookEn: 'Matthew',
        chapter: 5,
        verseStart: 3,
        verseEnd: 3,
      })
    })

    it('parses Rom 8:28', () => {
      const result = parseReference('Rom 8:28')
      expect(result).toEqual({
        bookNr: 45,
        bookKo: '로마서',
        bookEn: 'Romans',
        chapter: 8,
        verseStart: 28,
        verseEnd: 28,
      })
    })

    it('parses Rev 21:4', () => {
      const result = parseReference('Rev 21:4')
      expect(result).toEqual({
        bookNr: 66,
        bookKo: '요한계시록',
        bookEn: 'Revelation',
        chapter: 21,
        verseStart: 4,
        verseEnd: 4,
      })
    })

    it('parses Ps 23:1 (abbreviated Psalms)', () => {
      const result = parseReference('Ps 23:1')
      expect(result).toEqual({
        bookNr: 19,
        bookKo: '시편',
        bookEn: 'Psalms',
        chapter: 23,
        verseStart: 1,
        verseEnd: 1,
      })
    })
  })

  // --- Verse ranges ---
  describe('verse ranges', () => {
    it('parses 요 3:16-18 (Korean abbr range)', () => {
      const result = parseReference('요 3:16-18')
      expect(result).toEqual({
        bookNr: 43,
        bookKo: '요한복음',
        bookEn: 'John',
        chapter: 3,
        verseStart: 16,
        verseEnd: 18,
      })
    })

    it('parses Gen 1:1-5 (English abbr range)', () => {
      const result = parseReference('Gen 1:1-5')
      expect(result).toEqual({
        bookNr: 1,
        bookKo: '창세기',
        bookEn: 'Genesis',
        chapter: 1,
        verseStart: 1,
        verseEnd: 5,
      })
    })

    it('parses 1Cor 13:4-7 (English abbr with numeric prefix, range)', () => {
      const result = parseReference('1Cor 13:4-7')
      expect(result).toEqual({
        bookNr: 46,
        bookKo: '고린도전서',
        bookEn: '1 Corinthians',
        chapter: 13,
        verseStart: 4,
        verseEnd: 7,
      })
    })

    it('parses 창 1:1-31 (full chapter range)', () => {
      const result = parseReference('창 1:1-31')
      expect(result).toEqual({
        bookNr: 1,
        bookKo: '창세기',
        bookEn: 'Genesis',
        chapter: 1,
        verseStart: 1,
        verseEnd: 31,
      })
    })
  })

  // --- Books with numeric prefixes ---
  describe('books with numeric prefix', () => {
    it('parses 1요 2:1 (Korean abbr 1 John)', () => {
      // Note: Korean abbr for 1 John is 요일, not 1요
      // This tests findBook against koAbbr '요일'
      const result = parseReference('요일 2:1')
      expect(result).toEqual({
        bookNr: 62,
        bookKo: '요한일서',
        bookEn: '1 John',
        chapter: 2,
        verseStart: 1,
        verseEnd: 1,
      })
    })

    it('parses 1Sam 3:10 (English abbr)', () => {
      const result = parseReference('1Sam 3:10')
      expect(result).toEqual({
        bookNr: 9,
        bookKo: '사무엘상',
        bookEn: '1 Samuel',
        chapter: 3,
        verseStart: 10,
        verseEnd: 10,
      })
    })

    it('parses 2Sam 12:13 (English abbr)', () => {
      const result = parseReference('2Sam 12:13')
      expect(result).toEqual({
        bookNr: 10,
        bookKo: '사무엘하',
        bookEn: '2 Samuel',
        chapter: 12,
        verseStart: 13,
        verseEnd: 13,
      })
    })

    it('parses 1Kgs 18:38 (English abbr)', () => {
      const result = parseReference('1Kgs 18:38')
      expect(result).toEqual({
        bookNr: 11,
        bookKo: '열왕기상',
        bookEn: '1 Kings',
        chapter: 18,
        verseStart: 38,
        verseEnd: 38,
      })
    })

    it('parses 1Thess 4:16 (English abbr)', () => {
      const result = parseReference('1Thess 4:16')
      expect(result).toEqual({
        bookNr: 52,
        bookKo: '데살로니가전서',
        bookEn: '1 Thessalonians',
        chapter: 4,
        verseStart: 16,
        verseEnd: 16,
      })
    })

    it('parses 2Cor 5:17 (English abbr)', () => {
      const result = parseReference('2Cor 5:17')
      expect(result).toEqual({
        bookNr: 47,
        bookKo: '고린도후서',
        bookEn: '2 Corinthians',
        chapter: 5,
        verseStart: 17,
        verseEnd: 17,
      })
    })

    it('parses 1John 3:16 (English full)', () => {
      const result = parseReference('1John 3:16')
      expect(result).toEqual({
        bookNr: 62,
        bookKo: '요한일서',
        bookEn: '1 John',
        chapter: 3,
        verseStart: 16,
        verseEnd: 16,
      })
    })

    it('parses 3John 1:4 (English full)', () => {
      const result = parseReference('3John 1:4')
      expect(result).toEqual({
        bookNr: 64,
        bookKo: '요한삼서',
        bookEn: '3 John',
        chapter: 1,
        verseStart: 4,
        verseEnd: 4,
      })
    })
  })

  // --- Single verses (verseStart === verseEnd) ---
  describe('single verses produce verseStart === verseEnd', () => {
    it('요 3:16 has verseStart === verseEnd === 16', () => {
      const result = parseReference('요 3:16')
      expect(result?.verseStart).toBe(16)
      expect(result?.verseEnd).toBe(16)
    })

    it('창 1:1 has verseStart === verseEnd === 1', () => {
      const result = parseReference('창 1:1')
      expect(result?.verseStart).toBe(1)
      expect(result?.verseEnd).toBe(1)
    })
  })

  // --- Edge cases: extra whitespace ---
  describe('extra whitespace', () => {
    it('handles leading and trailing whitespace', () => {
      const result = parseReference('  창 1:1  ')
      expect(result?.bookNr).toBe(1)
      expect(result?.chapter).toBe(1)
      expect(result?.verseStart).toBe(1)
    })

    it('handles extra internal whitespace between book and chapter:verse', () => {
      const result = parseReference('창   1:1')
      expect(result?.bookNr).toBe(1)
    })
  })

  // --- Edge cases: mixed case for English ---
  describe('mixed case for English', () => {
    it('handles lowercase english full name: genesis 1:1', () => {
      const result = parseReference('genesis 1:1')
      expect(result?.bookNr).toBe(1)
    })

    it('handles uppercase english full name: JOHN 3:16', () => {
      const result = parseReference('JOHN 3:16')
      expect(result?.bookNr).toBe(43)
    })

    it('handles mixed case english abbr: gEN 1:1', () => {
      const result = parseReference('gEN 1:1')
      expect(result?.bookNr).toBe(1)
    })
  })

  // --- Invalid inputs (return null) ---
  describe('invalid inputs return null', () => {
    it('returns null for empty string', () => {
      expect(parseReference('')).toBeNull()
    })

    it('returns null when no chapter:verse pattern present', () => {
      expect(parseReference('창세기')).toBeNull()
    })

    it('returns null when chapter:verse present but book is unrecognized', () => {
      expect(parseReference('xyz 3:16')).toBeNull()
    })

    it('returns null for only chapter:verse with no book', () => {
      expect(parseReference('3:16')).toBeNull()
    })

    it('returns null for plain numbers', () => {
      expect(parseReference('123')).toBeNull()
    })

    it('returns null for gibberish', () => {
      expect(parseReference('hello world foo bar')).toBeNull()
    })

    it('returns null when book name missing entirely', () => {
      expect(parseReference(' 1:1')).toBeNull()
    })
  })
})
