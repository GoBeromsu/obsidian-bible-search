import { findBook } from '../domain/book-map'

export interface ParsedReference {
  bookNr: number
  bookKo: string
  bookEn: string
  chapter: number
  verseStart: number
  verseEnd: number
}

const CHAPTER_VERSE_RE = /(\d+):(\d+)(?:-(\d+))?\s*$/

export function parseReference(input: string): ParsedReference | null {
  const trimmed = input.trim()
  const match = trimmed.match(CHAPTER_VERSE_RE)
  if (!match) return null

  const chapter = parseInt(match[1]!, 10)
  const verseStart = parseInt(match[2]!, 10)
  const verseEnd = match[3] !== undefined ? parseInt(match[3], 10) : verseStart

  const bookPart = trimmed.slice(0, trimmed.length - match[0].length).trim()
  if (!bookPart) return null

  const book = findBook(bookPart)
  if (!book) return null

  return {
    bookNr: book.nr,
    bookKo: book.ko,
    bookEn: book.en,
    chapter,
    verseStart,
    verseEnd,
  }
}
