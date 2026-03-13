import { describe, expect, it } from 'vitest'

import { DEFAULT_SETTINGS } from '../src/plugin-settings'
import { VerseData } from '../src/sources/types'
import { formatVerses } from '../src/utils/formatter'
import { ParsedReference } from '../src/utils/reference-parser'

const GENESIS_1_1: VerseData = { chapter: 1, verse: 1, text: '태초에 하나님이 천지를 창조하시니라' }
const GENESIS_1_2: VerseData = { chapter: 1, verse: 2, text: '땅이 혼돈하고 공허하며...' }
const GENESIS_1_3: VerseData = { chapter: 1, verse: 3, text: '하나님이 이르시되 빛이 있으라 하시니 빛이 있었고' }
const JOHN_3_16: VerseData = { chapter: 3, verse: 16, text: '하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니...' }

const JOHN_REF: ParsedReference = { bookNr: 43, bookKo: '요한복음', bookEn: 'John', chapter: 3, verseStart: 16, verseEnd: 16 }
const GEN_1_1_REF: ParsedReference = { bookNr: 1, bookKo: '창세기', bookEn: 'Genesis', chapter: 1, verseStart: 1, verseEnd: 1 }
const GEN_1_1_2_REF: ParsedReference = { bookNr: 1, bookKo: '창세기', bookEn: 'Genesis', chapter: 1, verseStart: 1, verseEnd: 2 }
const GEN_1_1_3_REF: ParsedReference = { bookNr: 1, bookKo: '창세기', bookEn: 'Genesis', chapter: 1, verseStart: 1, verseEnd: 3 }

describe('formatVerses', () => {
  describe('default callout template', () => {
    it('single verse — no verse number even if showVerseNumbers is true', () => {
      const result = formatVerses(
        [JOHN_3_16],
        JOHN_REF,
        { ...DEFAULT_SETTINGS, showVerseNumbers: true },
      )
      expect(result).toBe(
        '> [!bible] 요한복음 (John) 3:16\n> 하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니...',
      )
    })

    it('single verse — verse range label shows "3:16" not "3:16-16"', () => {
      const result = formatVerses(
        [JOHN_3_16],
        JOHN_REF,
        DEFAULT_SETTINGS,
      )
      expect(result).toContain('3:16')
      expect(result).not.toContain('3:16-16')
    })

    it('multi-verse with showVerseNumbers true — prefixes each line with bold number', () => {
      const result = formatVerses(
        [GENESIS_1_1, GENESIS_1_2, GENESIS_1_3],
        GEN_1_1_3_REF,
        { ...DEFAULT_SETTINGS, showVerseNumbers: true },
      )
      expect(result).toBe(
        '> [!bible] 창세기 (Genesis) 1:1-3\n' +
        '> **1** 태초에 하나님이 천지를 창조하시니라\n' +
        '> **2** 땅이 혼돈하고 공허하며...\n' +
        '> **3** 하나님이 이르시되 빛이 있으라 하시니 빛이 있었고',
      )
    })

    it('multi-verse with showVerseNumbers false — no verse number prefixes', () => {
      const result = formatVerses(
        [GENESIS_1_1, GENESIS_1_2],
        GEN_1_1_2_REF,
        { ...DEFAULT_SETTINGS, showVerseNumbers: false },
      )
      expect(result).toBe(
        '> [!bible] 창세기 (Genesis) 1:1-2\n' +
        '> 태초에 하나님이 천지를 창조하시니라\n' +
        '> 땅이 혼돈하고 공허하며...',
      )
    })

    it('custom callout type is used instead of "bible"', () => {
      const result = formatVerses(
        [JOHN_3_16],
        JOHN_REF,
        { ...DEFAULT_SETTINGS, calloutType: 'quote' },
      )
      expect(result).toContain('[!quote]')
      expect(result).not.toContain('[!bible]')
    })

    it('verse range in title shows "1:1-3" for multi-verse range', () => {
      const result = formatVerses(
        [GENESIS_1_1, GENESIS_1_2, GENESIS_1_3],
        GEN_1_1_3_REF,
        DEFAULT_SETTINGS,
      )
      expect(result).toContain('1:1-3')
    })
  })

  describe('blockquote-style template', () => {
    const blockquoteSettings = {
      ...DEFAULT_SETTINGS,
      formatTemplate: '> {verses}\n> — {bookKo} ({bookEn}) {range}',
    }

    it('single verse — citation at end, no verse number', () => {
      const result = formatVerses(
        [GENESIS_1_1],
        GEN_1_1_REF,
        { ...blockquoteSettings, showVerseNumbers: true },
      )
      expect(result).toBe(
        '> 태초에 하나님이 천지를 창조하시니라\n' +
        '> — 창세기 (Genesis) 1:1',
      )
    })

    it('multi-verse blockquote with showVerseNumbers true — prefixes and citation', () => {
      const result = formatVerses(
        [GENESIS_1_1, GENESIS_1_2],
        GEN_1_1_2_REF,
        { ...blockquoteSettings, showVerseNumbers: true },
      )
      expect(result).toBe(
        '> **1** 태초에 하나님이 천지를 창조하시니라\n' +
        '> **2** 땅이 혼돈하고 공허하며...\n' +
        '> — 창세기 (Genesis) 1:1-2',
      )
    })

    it('multi-verse blockquote with showVerseNumbers false — no prefixes', () => {
      const result = formatVerses(
        [GENESIS_1_1, GENESIS_1_2],
        GEN_1_1_2_REF,
        { ...blockquoteSettings, showVerseNumbers: false },
      )
      expect(result).toBe(
        '> 태초에 하나님이 천지를 창조하시니라\n' +
        '> 땅이 혼돈하고 공허하며...\n' +
        '> — 창세기 (Genesis) 1:1-2',
      )
    })

    it('verse range in citation shows "1:1-2" for multi-verse', () => {
      const result = formatVerses(
        [GENESIS_1_1, GENESIS_1_2],
        GEN_1_1_2_REF,
        blockquoteSettings,
      )
      expect(result).toContain('1:1-2')
    })
  })

  describe('custom templates', () => {
    it('plain text template without blockquote prefix', () => {
      const result = formatVerses(
        [JOHN_3_16],
        JOHN_REF,
        { ...DEFAULT_SETTINGS, formatTemplate: '{bookEn} {range}\n{verses}' },
      )
      expect(result).toBe('John 3:16\n하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니...')
    })
  })
})
