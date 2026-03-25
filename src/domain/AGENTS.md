<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-25 | Updated: 2026-03-25 -->

# src/domain/ — Business Logic

## Purpose

Core domain logic for Bible verse search — models, caching, and settings management. **No Obsidian imports allowed.** All code here is testable in isolation and can be reused across platforms.

## Key Files

| File | Purpose |
|------|---------|
| `book-map.ts` | Bible book metadata (66 books, Korean/English names, abbreviations, chapter counts) and lookup functions |
| `settings.ts` | Settings schema and defaults (format template, cache TTL, Bible version pairs) |
| `verse-cache.ts` | In-memory verse data cache with TTL-based expiration (LRU map) |

## For AI Agents

- **obsidian-developer**: Implements domain logic — business rules, data models, caching algorithms.
- **obsidian-qa**: Verifies no Obsidian imports, tests with simple stubs (no mocks).

## Dependencies

- **Inbound**: `ui/` calls domain functions; `main.ts` wires the cache and settings.
- **Outbound**: `types/` (interfaces), `utils/` (helper functions).
- **External**: None (zero external package dependencies).

## Key Patterns

### Book Lookup

`book-map.ts` exports:
- `BIBLE_BOOKS`: Array of 66 books with full metadata.
- `findBook(input: string)`: Fuzzy-finds by Korean name, English name, or abbreviation.

Used by parsers to convert user input ("matthean 3:16") to book numbers.

### Settings Schema

`settings.ts` defines:
- `BibleSearchSettings` interface with version pairs, format template, cache TTL.
- `DEFAULT_SETTINGS` with sensible defaults (GAE for Korean, ESV for English).
- Settings migration in `main.ts` handles version upgrades.

### Verse Cache

`verse-cache.ts` implements:
- In-memory Map<key, VerseData[]> with timestamp-based TTL.
- Key format: `${version}:${bookNr}:${chapter}`.
- `get()`, `set()`, `clear()` for manual cache control.

## Testing

Domain functions are unit-tested in `test/`:
- `book-map.test.ts` — lookup accuracy, edge cases.
- `verse-cache.test.ts` — TTL expiration, cache hits/misses.
- No mocks required; all inputs are plain objects.
