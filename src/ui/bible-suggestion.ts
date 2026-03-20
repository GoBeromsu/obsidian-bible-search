import { BibleBookEntry } from '../domain/book-map'

export type BibleSuggestion =
  | { type: 'book'; book: BibleBookEntry }
  | { type: 'chapter'; book: BibleBookEntry; chapter: number }
  | { type: 'verse'; book: BibleBookEntry; chapter: number; verse: number; text: string }
  | { type: 'range'; book: BibleBookEntry; chapter: number; verseStart: number; verseEnd: number; preview: string }
