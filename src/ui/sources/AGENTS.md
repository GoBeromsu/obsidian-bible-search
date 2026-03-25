<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-25 | Updated: 2026-03-25 -->

# src/ui/sources/ — Bible Data Source Adapters

## Purpose

Encapsulates fetching and parsing Bible verses from multiple sources. Each adapter implements the `BibleSource` interface and handles:
- HTTP requests to the remote source.
- HTML/JSON parsing specific to that source.
- Normalization to uniform `VerseData[]` format.

## Key Files

| File | Purpose |
|------|---------|
| `source-registry.ts` | Source factory — maps Bible version codes to adapter instances (GAE/KRV/NIR → bskorea, ESV/KJV → bolls) |
| `bolls-api.ts` | Bolls.life REST API adapter — fetches ESV, KJV, and other English versions as JSON |
| `bskorea-scraper.ts` | Bible Society of Korea HTML scraper — fetches GAE, KRV, NIR (Korean versions) with DOM parsing |

## For AI Agents

- **obsidian-developer**: Implements source adapters — HTTP requests, response parsing, error handling.
- **obsidian-ui**: Calls `getSource(version)` to fetch chapters for display.
- **obsidian-qa**: Tests parsing logic against real API responses (fixtures: `test/fixtures/bolls-john-3.json`).

## Dependencies

- **Inbound**: `BibleSearchModal` calls `getSource()` to fetch verses; `source-registry.ts` exports the factory.
- **Outbound**: `types/` (BibleSource interface, VerseData), `domain/` (book-map for bskorea), `obsidian` (requestUrl).
- **External**: `obsidian.requestUrl()` for HTTP (supports CORS and auth headers).

## Key Patterns

### BibleSource Interface

All adapters implement:

```typescript
interface BibleSource {
  fetchChapter(versionCode: string, bookNr: number, chapter: number): Promise<VerseData[]>
}
```

Returns normalized array of verse objects with `{chapter, verse, text}`.

### Source Registry

`source-registry.ts`:
- Singleton instances: `bskorea = new BsKoreaScraper()`, `bolls = new BollsApi()`.
- Maps version → adapter: `SOURCE_MAP` and `BSKOREA_VERSION_MAP` (version code translation).
- `getSource(version)` throws if version unsupported.

### Bolls.life API Adapter

- **URL**: `https://bolls.life/get-chapter/{version}/{bookNr}/{chapter}/`.
- **Response**: JSON array of verse objects: `[{pk, verse, text}, ...]`.
- **Cleanup**: Strips HTML tags (`<S>`, `<sup>`) and normalizes whitespace.

### Bible Society of Korea Scraper

- **URL**: `https://www.bskorea.or.kr/bible/korbibReadpage.php?version={versionCode}&book={bskCode}&chap={chapter}`.
- **Response**: HTML with verse spans (class/structure varies by version).
- **Parsing**:
  - Extracts verse numbers from `<span class="number">`.
  - Clones verse parent span, removes noise elements (comments, footnotes, section headers).
  - Normalizes whitespace.

## Testing

- `bolls-api.test.ts` — parsing against JSON fixture (`test/fixtures/bolls-john-3.json`).
- `bskorea-scraper.test.ts` — HTML parsing with real or mocked HTML responses.
- Error cases: HTTP failures (status !== 200), malformed responses.
