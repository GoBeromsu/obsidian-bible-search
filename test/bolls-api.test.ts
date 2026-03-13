import { readFileSync } from 'fs'
import { resolve } from 'path'
import { describe, it, expect } from 'vitest'
import { parseBollsResponse, stripBollsTags } from '../src/sources/bolls-api'

const fixtureData: Array<{ pk: number; verse: number; text: string }> = JSON.parse(
  readFileSync(resolve(__dirname, 'fixtures/bolls-john-3.json'), 'utf-8'),
)

describe('parseBollsResponse', () => {
  const verses = parseBollsResponse(fixtureData, 3)

  it('returns 36 entries for John 3', () => {
    expect(verses).toHaveLength(36)
  })

  it('strips <S> tags from verse 1', () => {
    expect(verses[0].text).not.toContain('<S>')
  })

  it('verse 16 contains "For God so loved the world" without Strong\'s numbers', () => {
    const v16 = verses[15]
    expect(v16.text).toContain('For God so loved the world')
    expect(v16.text).not.toContain('<S>')
  })

  it('all verses have chapter: 3', () => {
    expect(verses.every(v => v.chapter === 3)).toBe(true)
  })
})

describe('stripBollsTags', () => {
  it('removes a single Strong\'s number tag', () => {
    expect(stripBollsTags('word<S>1234</S> test')).toBe('word test')
  })

  it('removes multiple Strong\'s number tags', () => {
    expect(stripBollsTags('born<S>1080</S> again<S>509</S>')).toBe('born again')
  })

  it('removes <sup> footnote tags', () => {
    expect(stripBollsTags('text <sup>again: or, from above</sup>')).toBe('text')
  })
})
