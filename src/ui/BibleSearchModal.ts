import { App, SuggestModal, Editor } from 'obsidian'
import { BibleBookEntry, BIBLE_BOOKS } from '../domain/book-map'
import { BibleSuggestion } from './bible-suggestion'
import { parseModalInput } from './parse-modal-input'
import { ParsedReference } from '../utils/reference-parser'
import { formatVerses, ExtraVerses } from '../utils/formatter'
import { getSource, getSourceVersionCode } from './sources/source-registry'
import { VerseCache } from '../domain/verse-cache'
import { VerseData } from '../types/index'
import { BibleSearchSettings } from '../domain/settings'
import { detectRequiredFetches } from '../utils/resolve-template'
import { PluginNotices } from '../shared/plugin-notices'

const PREVIEW_MAX_LEN = 60

const PLACEHOLDER = {
  book: 'Type book name (e.g. 요, Genesis, 창세기)',
  chapter: 'Select chapter (e.g. 3)',
  verse: 'Select verse or type range (e.g. 16, 1-3)',
} as const

function fuzzyMatch(query: string, text: string): boolean {
  const q = query.toLowerCase()
  const t = text.toLowerCase()
  let qi = 0
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (q[qi] === t[ti]) qi++
  }
  return qi === q.length
}

function truncate(text: string, max: number): string {
  return text.length > max ? text.slice(0, max) + '...' : text
}

function matchBooks(query: string): BibleBookEntry[] {
  if (!query) return BIBLE_BOOKS
  return BIBLE_BOOKS.filter(
    b =>
      fuzzyMatch(query, b.ko) ||
      fuzzyMatch(query, b.koAbbr) ||
      fuzzyMatch(query, b.en) ||
      fuzzyMatch(query, b.enAbbr),
  )
}

function buildChapterSuggestions(
  book: BibleBookEntry,
  filter: string,
): BibleSuggestion[] {
  const items: BibleSuggestion[] = []
  for (let ch = 1; ch <= book.maxChapter; ch++) {
    if (filter === '' || String(ch).startsWith(filter)) {
      items.push({ type: 'chapter', book, chapter: ch })
    }
  }
  return items
}

async function fetchChapterVerses(
  version: string,
  bookNr: number,
  chapter: number,
  cache: VerseCache,
  cacheEnabled: boolean,
): Promise<VerseData[]> {
  const sourceVersion = getSourceVersionCode(version)
  const source = getSource(version)

  if (cacheEnabled) {
    const cached = cache.get(version, bookNr, chapter)
    if (cached) return cached
  }

  const verses = await source.fetchChapter(sourceVersion, bookNr, chapter)
  if (cacheEnabled) {
    cache.set(version, bookNr, chapter, verses)
  }
  return verses
}

export class BibleSearchModal extends SuggestModal<BibleSuggestion> {
  private editor: Editor
  private settings: BibleSearchSettings
  private cache: VerseCache
  private notices: PluginNotices
  private chapterCache: { key: string; verses: VerseData[] } | null = null
  private renderCount = 0

  constructor(
    app: App,
    editor: Editor,
    settings: BibleSearchSettings,
    cache: VerseCache,
    notices: PluginNotices,
  ) {
    super(app)
    this.editor = editor
    this.settings = settings
    this.cache = cache
    this.notices = notices
    this.setPlaceholder(PLACEHOLDER.book)
  }

  private updatePlaceholder(mode: 'book' | 'chapter' | 'verse'): void {
    this.setPlaceholder(PLACEHOLDER[mode])
  }

  async getSuggestions(query: string): Promise<BibleSuggestion[]> {
    this.renderCount = 0
    const state = parseModalInput(query)

    if (state.mode === 'book') {
      this.updatePlaceholder('book')
      return matchBooks(state.query).map(book => ({ type: 'book' as const, book }))
    }

    if (state.mode === 'chapter') {
      this.updatePlaceholder('chapter')
      const chapters = buildChapterSuggestions(state.book, state.filter)
      // Auto-advance when exactly one chapter matches
      if (chapters.length === 1) {
        const only = chapters[0]!
        if (only.type !== 'chapter') return chapters
        const newValue = `${only.book.ko} ${only.chapter}:`
        this.inputEl.value = newValue
        this.inputEl.setSelectionRange(newValue.length, newValue.length)
        this.inputEl.dispatchEvent(new Event('input'))
        return []
      }
      return chapters
    }

    // verse mode — async fetch
    this.updatePlaceholder('verse')
    const { book, chapter, filter, rangeEnd } = state
    const cacheKey = `${book.nr}:${chapter}`
    let verses: VerseData[] | null = null

    if (this.chapterCache?.key === cacheKey) {
      verses = this.chapterCache.verses
    } else {
      try {
        verses = await fetchChapterVerses(
          this.settings.defaultVersion, book.nr, chapter,
          this.cache, this.settings.cacheEnabled,
        )
      } catch (err) {
        this.notices.show('fetch_chapter_failed', {
          bookKo: book.ko,
          chapter,
          error: err instanceof Error ? err.message : String(err),
        })
        return []
      }

      this.chapterCache = { key: cacheKey, verses }
    }

    // Range mode: single item
    if (rangeEnd !== undefined && filter !== '') {
      const verseStart = parseInt(filter, 10)
      const verseEnd = rangeEnd
      const selected = verses.filter(v => v.verse >= verseStart && v.verse <= verseEnd)
      if (selected.length === 0) return []
      const preview = selected.map(v => v.text).join(' ')
      return [{
        type: 'range',
        book,
        chapter,
        verseStart,
        verseEnd,
        preview: truncate(preview, PREVIEW_MAX_LEN),
      }]
    }

    // Single verse mode
    return verses
      .filter(v => filter === '' || String(v.verse).startsWith(filter))
      .map(v => ({
        type: 'verse' as const,
        book,
        chapter,
        verse: v.verse,
        text: truncate(v.text, PREVIEW_MAX_LEN),
      }))
  }

  renderSuggestion(item: BibleSuggestion, el: HTMLElement): void {
    const isFirst = this.renderCount === 0
    this.renderCount++

    if (item.type === 'book') {
      el.createEl('span', { text: `${item.book.ko} (${item.book.en})` })
      if (isFirst) el.createEl('span', { text: '↵ select', cls: 'bible-search-hint' })
      return
    }
    if (item.type === 'chapter') {
      el.createEl('span', { text: `${item.chapter}장` })
      if (isFirst) el.createEl('span', { text: '↵ select', cls: 'bible-search-hint' })
      return
    }
    if (item.type === 'verse') {
      el.createEl('span', { text: `${item.verse}절  ${item.text}` })
      if (isFirst) el.createEl('span', { text: '↵ insert', cls: 'bible-search-hint' })
      return
    }
    if (item.type === 'range') {
      el.createEl('span', { text: `${item.verseStart}-${item.verseEnd}절  ${item.preview}` })
      if (isFirst) el.createEl('span', { text: '↵ insert', cls: 'bible-search-hint' })
    }
  }

  selectSuggestion(value: BibleSuggestion, evt: MouseEvent | KeyboardEvent): void {
    if (value.type === 'book') {
      // Single-chapter books skip to verse mode directly
      const newValue = value.book.maxChapter === 1
        ? `${value.book.ko} 1:`
        : `${value.book.ko} `
      this.inputEl.value = newValue
      const len = newValue.length
      this.inputEl.setSelectionRange(len, len)
      this.inputEl.dispatchEvent(new Event('input'))
      return
    }

    if (value.type === 'chapter') {
      const newValue = `${value.book.ko} ${value.chapter}:`
      this.inputEl.value = newValue
      const len = newValue.length
      this.inputEl.setSelectionRange(len, len)
      this.inputEl.dispatchEvent(new Event('input'))
      return
    }

    // verse or range — close and insert
    super.selectSuggestion(value, evt)
  }

  async onChooseSuggestion(item: BibleSuggestion, _evt: MouseEvent | KeyboardEvent): Promise<void> {
    if (item.type === 'book' || item.type === 'chapter') return

    let ref: ParsedReference
    if (item.type === 'verse') {
      ref = {
        bookNr: item.book.nr,
        bookKo: item.book.ko,
        bookEn: item.book.en,
        chapter: item.chapter,
        verseStart: item.verse,
        verseEnd: item.verse,
      }
    } else {
      ref = {
        bookNr: item.book.nr,
        bookKo: item.book.ko,
        bookEn: item.book.en,
        chapter: item.chapter,
        verseStart: item.verseStart,
        verseEnd: item.verseEnd,
      }
    }

    try {
      const version = this.settings.defaultVersion
      const cacheKey = `${item.book.nr}:${item.chapter}`

      // Fetch default version verses
      let allVerses: VerseData[] | null = null
      if (this.chapterCache?.key === cacheKey) {
        allVerses = this.chapterCache.verses
      }

      if (!allVerses) {
        allVerses = await fetchChapterVerses(
          version, ref.bookNr, ref.chapter,
          this.cache, this.settings.cacheEnabled,
        )
      }

      const selected = allVerses.filter(v => v.verse >= ref.verseStart && v.verse <= ref.verseEnd)
      if (selected.length === 0) {
        this.notices.show('no_verses_found', {
          bookKo: ref.bookKo,
          chapter: ref.chapter,
          verseStart: ref.verseStart,
          verseEnd: ref.verseEnd,
        })
        return
      }

      // Detect which extra fetches the template needs
      const required = detectRequiredFetches(this.settings.formatTemplate)
      const extraVerses: ExtraVerses = {}
      const fetches: Promise<void>[] = []

      const queueExtraFetch = (
        extraVersion: string,
        assign: (verses: VerseData[]) => void,
      ) => {
        if (extraVersion === version) {
          assign(selected)
        } else {
          fetches.push(
            fetchChapterVerses(extraVersion, ref.bookNr, ref.chapter, this.cache, this.settings.cacheEnabled)
              .then(all => assign(all.filter(v => v.verse >= ref.verseStart && v.verse <= ref.verseEnd))),
          )
        }
      }

      if (required.needsKorean) {
        queueExtraFetch(this.settings.koreanVersion, v => { extraVerses.korean = v })
      }
      if (required.needsEnglish) {
        queueExtraFetch(this.settings.englishVersion, v => { extraVerses.english = v })
      }

      const results = await Promise.allSettled(fetches)
      for (const r of results) {
        if (r.status === 'rejected') {
          this.notices.show('fetch_extra_version_failed', {
            error: r.reason instanceof Error ? r.reason.message : String(r.reason),
          })
        }
      }

      const formatted = formatVerses(selected, ref, this.settings, extraVerses)
      this.editor.replaceSelection(formatted)
    } catch (error) {
      this.notices.show('fetch_verse_failed', {
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }
}
