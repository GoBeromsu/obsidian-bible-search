<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-25 | Updated: 2026-03-25 -->

# src/utils/ — Utility Functions

## Purpose

Pure utility functions with **zero external dependencies and zero state**. All functions are deterministic and testable without mocks.

## Key Files

| File | Purpose |
|------|---------|
| `reference-parser.ts` | Parse Bible references (e.g., "Matthew 3:16-18") into structured data |
| `formatter.ts` | Format verse arrays into human-readable text using template strings |
| `resolve-template.ts` | Template resolution engine — detects required fetches and interpolates verse data |

## For AI Agents

- **obsidian-developer**: Implements parsing and formatting logic — regex, string manipulation, template engines.
- **obsidian-qa**: Unit tests are straightforward (plain objects in/out, no mocks).

## Dependencies

- **Inbound**: `ui/` (parsing, formatting), `domain/` (template resolution).
- **Outbound**: `types/`, `domain/book-map` (for reference parser lookup).
- **External**: None.

## Key Functions

### reference-parser.ts

**parseReference(input: string): ParsedReference | null**

Parses user input into structured reference data:

```typescript
interface ParsedReference {
  bookNr: number
  bookKo: string
  bookEn: string
  chapter: number
  verseStart: number
  verseEnd: number
}
```

Input examples:
- "Matthew 3:16" → `{bookNr: 40, bookKo: '마태복음', bookEn: 'Matthew', chapter: 3, verseStart: 16, verseEnd: 16}`
- "Rom 12:1-5" → `{bookNr: 45, bookKo: '로마서', bookEn: 'Romans', chapter: 12, verseStart: 1, verseEnd: 5}`
- "invalid" → `null`

Regex: `/(\d+):(\d+)(?:-(\d+))?\s*$/` matches chapter:verse[-end] at end of string.

### formatter.ts

**formatVerses(template: string, data: TemplateContext): string**

Interpolates verse data into user-defined template. Supports:
- `{bookEn}`, `{bookKo}` — book names.
- `{chapter}`, `{range}` — chapter and verse range.
- `{versesKo}`, `{versesEn}` — formatted verse text.
- `{showVerseNumbers}` — conditional verse number display.

Example template:
```
> [[{bookEn} {chapter}]]:{range}
> {versesKo}
>
> {versesEn}
```

### resolve-template.ts

**detectRequiredFetches(template: string): FetchRequest[]**

Analyzes template to determine which versions (Korean, English, extra) need fetching before formatting. Returns list of fetches needed.

## Testing

Unit tests in `test/`:
- `reference-parser.test.ts` — parsing edge cases (ranges, abbreviations, invalid input).
- `formatter.test.ts` — template interpolation with multiple verse texts.
- `resolve-template.test.ts` — template analysis and fetch detection.

All tests use plain objects; no mocks or external dependencies.
