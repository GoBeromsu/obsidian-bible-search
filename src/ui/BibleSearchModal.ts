import { App, FuzzySuggestModal, Notice, Editor } from 'obsidian'
import { BibleBookEntry, BIBLE_BOOKS } from '../data/book-map'
import { ParsedReference } from '../utils/reference-parser'
import { formatVerses } from '../utils/formatter'
import { getSource, getSourceVersionCode } from '../sources/source-registry'
import { VerseCache } from '../cache/verse-cache'
import { BibleSearchSettings } from '../plugin-settings'

const CHAPTER_VERSE_RE = /(\d+):(\d+)(?:-(\d+))?\s*$/

export class BibleSearchModal extends FuzzySuggestModal<BibleBookEntry> {
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

  getItems(): BibleBookEntry[] {
    return BIBLE_BOOKS
  }

  getItemText(item: BibleBookEntry): string {
    return `${item.ko} (${item.en})`
  }

  async onChooseItem(item: BibleBookEntry): Promise<void> {
    // Use item (the fuzzy-selected book) directly — don't re-parse the book from input
    // Only extract chapter:verse from the raw input text
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
