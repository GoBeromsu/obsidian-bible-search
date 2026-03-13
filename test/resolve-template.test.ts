import { describe, expect, it } from 'vitest'
import { resolveTemplate, TemplateContext } from '../src/utils/resolve-template'

const BASE_CTX: TemplateContext = {
  bookKo: '요한복음',
  bookEn: 'John',
  chapter: '3',
  range: '3:16',
  verses: ['하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니...'],
  version: 'GAE',
  calloutType: 'bible',
}

const MULTI_VERSE_CTX: TemplateContext = {
  bookKo: '창세기',
  bookEn: 'Genesis',
  chapter: '1',
  range: '1:1-3',
  verses: [
    '**1** 태초에 하나님이 천지를 창조하시니라',
    '**2** 땅이 혼돈하고 공허하며...',
    '**3** 하나님이 이르시되 빛이 있으라 하시니 빛이 있었고',
  ],
  version: 'GAE',
  calloutType: 'bible',
}

describe('resolveTemplate', () => {
  it('single verse with callout template', () => {
    const template = '> [!{calloutType}] {bookKo} ({bookEn}) {range}\n> {verses}'
    const result = resolveTemplate(template, BASE_CTX)
    expect(result).toBe(
      '> [!bible] 요한복음 (John) 3:16\n' +
      '> 하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니...',
    )
  })

  it('multi-verse with > prefix inheritance', () => {
    const template = '> [!{calloutType}] {bookKo} ({bookEn}) {range}\n> {verses}'
    const result = resolveTemplate(template, MULTI_VERSE_CTX)
    expect(result).toBe(
      '> [!bible] 창세기 (Genesis) 1:1-3\n' +
      '> **1** 태초에 하나님이 천지를 창조하시니라\n' +
      '> **2** 땅이 혼돈하고 공허하며...\n' +
      '> **3** 하나님이 이르시되 빛이 있으라 하시니 빛이 있었고',
    )
  })

  it('blockquote-style template with citation at end', () => {
    const template = '> {verses}\n> — {bookKo} ({bookEn}) {range}'
    const result = resolveTemplate(template, BASE_CTX)
    expect(result).toBe(
      '> 하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니...\n' +
      '> — 요한복음 (John) 3:16',
    )
  })

  it('plain text template — no prefix on verses', () => {
    const template = '{bookKo} {range}\n{verses}'
    const result = resolveTemplate(template, MULTI_VERSE_CTX)
    expect(result).toBe(
      '창세기 1:1-3\n' +
      '**1** 태초에 하나님이 천지를 창조하시니라\n' +
      '**2** 땅이 혼돈하고 공허하며...\n' +
      '**3** 하나님이 이르시되 빛이 있으라 하시니 빛이 있었고',
    )
  })

  it('empty/whitespace template falls back to default', () => {
    const result = resolveTemplate('   ', BASE_CTX)
    expect(result).toBe(
      '> [!bible] 요한복음 (John) 3:16\n' +
      '> 하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니...',
    )
  })

  it('unknown tokens are left as-is', () => {
    const template = '{bookKo} {unknownToken} {range}\n{verses}'
    const result = resolveTemplate(template, BASE_CTX)
    expect(result).toContain('{unknownToken}')
  })

  it('version token is replaced', () => {
    const template = '{bookKo} {range} ({version})\n{verses}'
    const result = resolveTemplate(template, BASE_CTX)
    expect(result).toContain('(GAE)')
  })

  it('suffix after {verses} is preserved on each line', () => {
    const template = '| {verses} |'
    const result = resolveTemplate(template, MULTI_VERSE_CTX)
    expect(result).toBe(
      '| **1** 태초에 하나님이 천지를 창조하시니라 |\n' +
      '| **2** 땅이 혼돈하고 공허하며... |\n' +
      '| **3** 하나님이 이르시되 빛이 있으라 하시니 빛이 있었고 |',
    )
  })
})
