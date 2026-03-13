import { VerseData } from '../sources/types'

interface CacheEntry {
  data: VerseData[]
  timestamp: number
}

export class VerseCache {
  private cache = new Map<string, CacheEntry>()
  private ttlMs: number

  constructor(ttlMinutes: number = 30) {
    this.ttlMs = ttlMinutes * 60 * 1000
  }

  private key(version: string, bookNr: number, chapter: number): string {
    return `${version}:${bookNr}:${chapter}`
  }

  get(version: string, bookNr: number, chapter: number): VerseData[] | null {
    const k = this.key(version, bookNr, chapter)
    const entry = this.cache.get(k)
    if (!entry) return null
    if (Date.now() - entry.timestamp > this.ttlMs) {
      this.cache.delete(k)
      return null
    }
    return entry.data
  }

  set(version: string, bookNr: number, chapter: number, data: VerseData[]): void {
    this.cache.set(this.key(version, bookNr, chapter), { data, timestamp: Date.now() })
  }

  clear(): void {
    this.cache.clear()
  }
}
