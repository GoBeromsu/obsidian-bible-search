import { BibleBookEntry, findBook } from '../data/book-map'

export type ModalInputState =
  | { mode: 'book'; query: string }
  | { mode: 'chapter'; book: BibleBookEntry; filter: string }
  | { mode: 'verse'; book: BibleBookEntry; chapter: number; filter: string; rangeEnd?: number }

// Matches: "<book> <digits>" — chapter mode (no colon)
const CHAPTER_ONLY_RE = /^(.+?)\s+(\d+)$/
// Matches: "<book> <digits>:<optional-digits><optional -digits>" — verse mode
const VERSE_RE = /^(.+?)\s+(\d+):(\d*)(?:-(\d*))?$/

export function parseModalInput(input: string): ModalInputState {
  const trimmed = input.trim()

  if (!trimmed) {
    return { mode: 'book', query: '' }
  }

  // Try verse mode first (has colon)
  if (trimmed.includes(':')) {
    const verseMatch = trimmed.match(VERSE_RE)
    if (verseMatch) {
      const bookPart = verseMatch[1]
      const chapterStr = verseMatch[2]
      const verseFilter = verseMatch[3] ?? ''
      const rangeEndStr = verseMatch[4]

      const book = findBook(bookPart)
      if (book) {
        const chapter = parseInt(chapterStr, 10)
        const rangeEnd = rangeEndStr !== undefined && rangeEndStr !== ''
          ? parseInt(rangeEndStr, 10)
          : undefined
        return { mode: 'verse', book, chapter, filter: verseFilter, rangeEnd }
      }
    }
  }

  // Try chapter mode (digits, no colon)
  const chapterMatch = trimmed.match(CHAPTER_ONLY_RE)
  if (chapterMatch) {
    const bookPart = chapterMatch[1]
    const chapterFilter = chapterMatch[2]

    const book = findBook(bookPart)
    if (book) {
      return { mode: 'chapter', book, filter: chapterFilter }
    }
  }

  // Check if input ends with a space after a recognized book (chapter mode, empty filter)
  // e.g. "창세기 " — trailing space after exact book name
  if (input.endsWith(' ')) {
    const bookPart = trimmed
    const book = findBook(bookPart)
    if (book) {
      return { mode: 'chapter', book, filter: '' }
    }
  }

  // Default: book search mode
  return { mode: 'book', query: trimmed }
}
