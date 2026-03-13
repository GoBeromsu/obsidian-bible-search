export interface BibleBookEntry {
  nr: number
  ko: string
  koAbbr: string
  en: string
  enAbbr: string
  bskCode: string
}

export const BIBLE_BOOKS: BibleBookEntry[] = [
  // Old Testament
  { nr: 1,  ko: '창세기',          koAbbr: '창',   en: 'Genesis',         enAbbr: 'Gen',    bskCode: 'gen' },
  { nr: 2,  ko: '출애굽기',        koAbbr: '출',   en: 'Exodus',          enAbbr: 'Exod',   bskCode: 'exo' },
  { nr: 3,  ko: '레위기',          koAbbr: '레',   en: 'Leviticus',       enAbbr: 'Lev',    bskCode: 'lev' },
  { nr: 4,  ko: '민수기',          koAbbr: '민',   en: 'Numbers',         enAbbr: 'Num',    bskCode: 'num' },
  { nr: 5,  ko: '신명기',          koAbbr: '신',   en: 'Deuteronomy',     enAbbr: 'Deut',   bskCode: 'deu' },
  { nr: 6,  ko: '여호수아',        koAbbr: '수',   en: 'Joshua',          enAbbr: 'Josh',   bskCode: 'jos' },
  { nr: 7,  ko: '사사기',          koAbbr: '삿',   en: 'Judges',          enAbbr: 'Judg',   bskCode: 'jdg' },
  { nr: 8,  ko: '룻기',            koAbbr: '룻',   en: 'Ruth',            enAbbr: 'Ruth',   bskCode: 'rut' },
  { nr: 9,  ko: '사무엘상',        koAbbr: '삼상', en: '1 Samuel',        enAbbr: '1Sam',   bskCode: '1sa' },
  { nr: 10, ko: '사무엘하',        koAbbr: '삼하', en: '2 Samuel',        enAbbr: '2Sam',   bskCode: '2sa' },
  { nr: 11, ko: '열왕기상',        koAbbr: '왕상', en: '1 Kings',         enAbbr: '1Kgs',   bskCode: '1ki' },
  { nr: 12, ko: '열왕기하',        koAbbr: '왕하', en: '2 Kings',         enAbbr: '2Kgs',   bskCode: '2ki' },
  { nr: 13, ko: '역대상',          koAbbr: '대상', en: '1 Chronicles',    enAbbr: '1Chr',   bskCode: '1ch' },
  { nr: 14, ko: '역대하',          koAbbr: '대하', en: '2 Chronicles',    enAbbr: '2Chr',   bskCode: '2ch' },
  { nr: 15, ko: '에스라',          koAbbr: '스',   en: 'Ezra',            enAbbr: 'Ezra',   bskCode: 'ezr' },
  { nr: 16, ko: '느헤미야',        koAbbr: '느',   en: 'Nehemiah',        enAbbr: 'Neh',    bskCode: 'neh' },
  { nr: 17, ko: '에스더',          koAbbr: '에',   en: 'Esther',          enAbbr: 'Esth',   bskCode: 'est' },
  { nr: 18, ko: '욥기',            koAbbr: '욥',   en: 'Job',             enAbbr: 'Job',    bskCode: 'job' },
  { nr: 19, ko: '시편',            koAbbr: '시',   en: 'Psalms',          enAbbr: 'Ps',     bskCode: 'psa' },
  { nr: 20, ko: '잠언',            koAbbr: '잠',   en: 'Proverbs',        enAbbr: 'Prov',   bskCode: 'pro' },
  { nr: 21, ko: '전도서',          koAbbr: '전',   en: 'Ecclesiastes',    enAbbr: 'Eccl',   bskCode: 'ecc' },
  { nr: 22, ko: '아가',            koAbbr: '아',   en: 'Song of Solomon', enAbbr: 'Song',   bskCode: 'sng' },
  { nr: 23, ko: '이사야',          koAbbr: '사',   en: 'Isaiah',          enAbbr: 'Isa',    bskCode: 'isa' },
  { nr: 24, ko: '예레미야',        koAbbr: '렘',   en: 'Jeremiah',        enAbbr: 'Jer',    bskCode: 'jer' },
  { nr: 25, ko: '예레미야애가',    koAbbr: '애',   en: 'Lamentations',    enAbbr: 'Lam',    bskCode: 'lam' },
  { nr: 26, ko: '에스겔',          koAbbr: '겔',   en: 'Ezekiel',         enAbbr: 'Ezek',   bskCode: 'ezk' },
  { nr: 27, ko: '다니엘',          koAbbr: '단',   en: 'Daniel',          enAbbr: 'Dan',    bskCode: 'dan' },
  { nr: 28, ko: '호세아',          koAbbr: '호',   en: 'Hosea',           enAbbr: 'Hos',    bskCode: 'hos' },
  { nr: 29, ko: '요엘',            koAbbr: '욜',   en: 'Joel',            enAbbr: 'Joel',   bskCode: 'jol' },
  { nr: 30, ko: '아모스',          koAbbr: '암',   en: 'Amos',            enAbbr: 'Amos',   bskCode: 'amo' },
  { nr: 31, ko: '오바댜',          koAbbr: '옵',   en: 'Obadiah',         enAbbr: 'Obad',   bskCode: 'oba' },
  { nr: 32, ko: '요나',            koAbbr: '욘',   en: 'Jonah',           enAbbr: 'Jonah',  bskCode: 'jnh' },
  { nr: 33, ko: '미가',            koAbbr: '미',   en: 'Micah',           enAbbr: 'Mic',    bskCode: 'mic' },
  { nr: 34, ko: '나훔',            koAbbr: '나',   en: 'Nahum',           enAbbr: 'Nah',    bskCode: 'nah' },
  { nr: 35, ko: '하박국',          koAbbr: '합',   en: 'Habakkuk',        enAbbr: 'Hab',    bskCode: 'hab' },
  { nr: 36, ko: '스바냐',          koAbbr: '습',   en: 'Zephaniah',       enAbbr: 'Zeph',   bskCode: 'zep' },
  { nr: 37, ko: '학개',            koAbbr: '학',   en: 'Haggai',          enAbbr: 'Hag',    bskCode: 'hag' },
  { nr: 38, ko: '스가랴',          koAbbr: '슥',   en: 'Zechariah',       enAbbr: 'Zech',   bskCode: 'zec' },
  { nr: 39, ko: '말라기',          koAbbr: '말',   en: 'Malachi',         enAbbr: 'Mal',    bskCode: 'mal' },
  // New Testament
  { nr: 40, ko: '마태복음',        koAbbr: '마',   en: 'Matthew',         enAbbr: 'Matt',   bskCode: 'mat' },
  { nr: 41, ko: '마가복음',        koAbbr: '막',   en: 'Mark',            enAbbr: 'Mark',   bskCode: 'mrk' },
  { nr: 42, ko: '누가복음',        koAbbr: '눅',   en: 'Luke',            enAbbr: 'Luke',   bskCode: 'luk' },
  { nr: 43, ko: '요한복음',        koAbbr: '요',   en: 'John',            enAbbr: 'John',   bskCode: 'jhn' },
  { nr: 44, ko: '사도행전',        koAbbr: '행',   en: 'Acts',            enAbbr: 'Acts',   bskCode: 'act' },
  { nr: 45, ko: '로마서',          koAbbr: '롬',   en: 'Romans',          enAbbr: 'Rom',    bskCode: 'rom' },
  { nr: 46, ko: '고린도전서',      koAbbr: '고전', en: '1 Corinthians',   enAbbr: '1Cor',   bskCode: '1co' },
  { nr: 47, ko: '고린도후서',      koAbbr: '고후', en: '2 Corinthians',   enAbbr: '2Cor',   bskCode: '2co' },
  { nr: 48, ko: '갈라디아서',      koAbbr: '갈',   en: 'Galatians',       enAbbr: 'Gal',    bskCode: 'gal' },
  { nr: 49, ko: '에베소서',        koAbbr: '엡',   en: 'Ephesians',       enAbbr: 'Eph',    bskCode: 'eph' },
  { nr: 50, ko: '빌립보서',        koAbbr: '빌',   en: 'Philippians',     enAbbr: 'Phil',   bskCode: 'php' },
  { nr: 51, ko: '골로새서',        koAbbr: '골',   en: 'Colossians',      enAbbr: 'Col',    bskCode: 'col' },
  { nr: 52, ko: '데살로니가전서',  koAbbr: '살전', en: '1 Thessalonians', enAbbr: '1Thess', bskCode: '1th' },
  { nr: 53, ko: '데살로니가후서',  koAbbr: '살후', en: '2 Thessalonians', enAbbr: '2Thess', bskCode: '2th' },
  { nr: 54, ko: '디모데전서',      koAbbr: '딤전', en: '1 Timothy',       enAbbr: '1Tim',   bskCode: '1ti' },
  { nr: 55, ko: '디모데후서',      koAbbr: '딤후', en: '2 Timothy',       enAbbr: '2Tim',   bskCode: '2ti' },
  { nr: 56, ko: '디도서',          koAbbr: '딛',   en: 'Titus',           enAbbr: 'Titus',  bskCode: 'tit' },
  { nr: 57, ko: '빌레몬서',        koAbbr: '몬',   en: 'Philemon',        enAbbr: 'Phlm',   bskCode: 'phm' },
  { nr: 58, ko: '히브리서',        koAbbr: '히',   en: 'Hebrews',         enAbbr: 'Heb',    bskCode: 'heb' },
  { nr: 59, ko: '야고보서',        koAbbr: '약',   en: 'James',           enAbbr: 'Jas',    bskCode: 'jas' },
  { nr: 60, ko: '베드로전서',      koAbbr: '벧전', en: '1 Peter',         enAbbr: '1Pet',   bskCode: '1pe' },
  { nr: 61, ko: '베드로후서',      koAbbr: '벧후', en: '2 Peter',         enAbbr: '2Pet',   bskCode: '2pe' },
  { nr: 62, ko: '요한일서',        koAbbr: '요일', en: '1 John',          enAbbr: '1John',  bskCode: '1jn' },
  { nr: 63, ko: '요한이서',        koAbbr: '요이', en: '2 John',          enAbbr: '2John',  bskCode: '2jn' },
  { nr: 64, ko: '요한삼서',        koAbbr: '요삼', en: '3 John',          enAbbr: '3John',  bskCode: '3jn' },
  { nr: 65, ko: '유다서',          koAbbr: '유',   en: 'Jude',            enAbbr: 'Jude',   bskCode: 'jud' },
  { nr: 66, ko: '요한계시록',      koAbbr: '계',   en: 'Revelation',      enAbbr: 'Rev',    bskCode: 'rev' },
]

export function findBook(query: string): BibleBookEntry | undefined {
  const trimmed = query.trim()
  const lower = trimmed.toLowerCase()

  return BIBLE_BOOKS.find(
    (b) =>
      b.ko === trimmed ||
      b.koAbbr === trimmed ||
      b.en.toLowerCase() === lower ||
      b.enAbbr.toLowerCase() === lower,
  )
}
