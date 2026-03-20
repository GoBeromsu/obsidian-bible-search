export interface VerseData {
  chapter: number
  verse: number
  text: string
}

export interface BibleSource {
  fetchChapter(versionCode: string, bookNr: number, chapter: number): Promise<VerseData[]>
}
