import { describe, it, expect } from 'vitest'
import { findBookBestMatch } from '../src/domain/book-map'

describe('findBookBestMatch', () => {
  describe('exact match delegation', () => {
    it('matches Korean full name', () => {
      expect(findBookBestMatch('창세기')?.en).toBe('Genesis')
    })

    it('matches English full name', () => {
      expect(findBookBestMatch('Genesis')?.ko).toBe('창세기')
    })

    it('matches English abbreviation', () => {
      expect(findBookBestMatch('Gen')?.ko).toBe('창세기')
    })

    it('matches Korean abbreviation (요 -> 요한복음)', () => {
      expect(findBookBestMatch('요')?.ko).toBe('요한복음')
    })
  })

  describe('prefix match', () => {
    it('"Genesi" -> Genesis (unique English prefix)', () => {
      expect(findBookBestMatch('Genesi')?.en).toBe('Genesis')
    })

    it('"gene" -> Genesis (case-insensitive English prefix)', () => {
      expect(findBookBestMatch('gene')?.en).toBe('Genesis')
    })

    it('"요한복" -> 요한복음 (unique Korean prefix)', () => {
      expect(findBookBestMatch('요한복')?.ko).toBe('요한복음')
    })
  })

  describe('ambiguous prefix', () => {
    it('"요한" -> undefined (matches 요한복음, 요한일서, 요한이서, 요한삼서, 요한계시록)', () => {
      expect(findBookBestMatch('요한')).toBeUndefined()
    })

    it('"사" -> 이사야 (exact koAbbr match)', () => {
      expect(findBookBestMatch('사')?.ko).toBe('이사야')
    })

    it('"사무" -> undefined (matches 사무엘상 and 사무엘하)', () => {
      expect(findBookBestMatch('사무')).toBeUndefined()
    })
  })

  describe('no match', () => {
    it('"xyz" -> undefined', () => {
      expect(findBookBestMatch('xyz')).toBeUndefined()
    })

    it('empty string -> undefined', () => {
      expect(findBookBestMatch('')).toBeUndefined()
    })
  })
})
