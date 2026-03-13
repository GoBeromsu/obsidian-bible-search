import { App, SuggestModal, Notice, Editor } from 'obsidian'
import { BibleBookEntry, BIBLE_BOOKS, findBook } from '../data/book-map'
import { ParsedReference } from '../utils/reference-parser'
import { formatVerses } from '../utils/formatter'
import { getSource, getSourceVersionCode } from '../sources/source-registry'
import { VerseCache } from '../cache/verse-cache'
import { BibleSearchSettings } from '../plugin-settings'

const CHAPTER_VERSE_RE = /(\d+):(\d+)(?:-(\d+))?\s*$/

function extractBookQuery(input: string): string {
  const trimmed = input.trim()
  const cvMatch = trimmed.match(CHAPTER_VERSE_RE)
  if (!cvMatch) return trimmed
  return trimmed.slice(0, trimmed.length - cvMatch[0].length).trim()
}

function fuzzyMatch(query: string, text: string): boolean {
  const q = query.toLowerCase()
  const t = text.toLowerCase()
  let qi = 0
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (q[qi] === t[ti]) qi++
  }
  return qi === q.length
}

export class BibleSearchModal extends SuggestModal<BibleBookEntry> {
  private editor: Editor
  private settings: BibleSearchSettings
  private cache: VerseCache

  constructor(app: App, editor: Editor, settings: BibleSearchSettings, cache: VerseCache) {
    super(app)
    this.editor = editor
    this.settings = settings
    this.cache = cache
    this.setPlaceholder('Type a Bible reference (e.g. 요 3:16, John 3:16)')
  }

  getSuggestions(query: string): BibleBookEntry[] {
    const bookQuery = extractBookQuery(query)
    if (!bookQuery) return BIBLE_BOOKS

    // Exact match first
    const exact = findBook(bookQuery)
    if (exact) return [exact]

    // Fuzzy match against all name fields
    return BIBLE_BOOKS.filter(b =>
      fuzzyMatch(bookQuery, b.ko) ||
      fuzzyMatch(bookQuery, b.koAbbr) ||
      fuzzyMatch(bookQuery, b.en) ||
      fuzzyMatch(bookQuery, b.enAbbr),
    )
  }

  renderSuggestion(item: BibleBookEntry, el: HTMLElement): void {
    el.createEl('span', { text: `${item.ko} (${item.en})` })
  }

  async onChooseSuggestion(item: BibleBookEntry): Promise<void> {
    const input = this.inputEl.value
    const cvMatch = input.match(CHAPTER_VERSE_RE)
    if (!cvMatch) {
      new Notice('Could not parse chapter:verse. Use format: 요 3:16 or John 3:16')
      return
    }

    const chapter = parseInt(cvMatch[1], 10)
    const verseStart = parseInt(cvMatch[2], 10)
    const verseEnd = cvMatch[3] ? parseInt(cvMatch[3], 10) : verseStart

    const ref: ParsedReference = {
      bookNr: item.nr,
      bookKo: item.ko,
      bookEn: item.en,
      chapter,
      verseStart,
      verseEnd,
    }

    try {
      const version = this.settings.defaultVersion
      const sourceVersion = getSourceVersionCode(version)
      const source = getSource(version)

      let verses = this.settings.cacheEnabled
        ? this.cache.get(version, ref.bookNr, ref.chapter)
        : null

      if (!verses) {
        verses = await source.fetchChapter(sourceVersion, ref.bookNr, ref.chapter)
        if (this.settings.cacheEnabled) {
          this.cache.set(version, ref.bookNr, ref.chapter, verses)
        }
      }

      const selected = verses.filter(v => v.verse >= ref.verseStart && v.verse <= ref.verseEnd)
      if (selected.length === 0) {
        new Notice(`No verses found for ${ref.bookKo} ${ref.chapter}:${ref.verseStart}-${ref.verseEnd}`)
        return
      }

      const formatted = formatVerses(selected, ref, this.settings)
      this.editor.replaceSelection(formatted)
    } catch (error) {
      new Notice(`Failed to fetch verse: ${error instanceof Error ? error.message : String(error)}`)
    }
  }
}
