<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-25 | Updated: 2026-03-25 -->

# obsidian-bible-search

## Purpose
Bible Search — Obsidian plugin for searching Korean/English Bible verses and inserting them with configurable template formats. Supports multiple Bible sources (Bolls API, BSKorea scraper) with a verse cache for offline use. Works on mobile and desktop.

## Key Files

| File | Description |
|------|-------------|
| `src/main.ts` | Composition root — BibleSearchPlugin, commands, modal registration |
| `src/domain/settings.ts` | DEFAULT_SETTINGS, BibleSearchSettings interface |
| `src/domain/book-map.ts` | Book name → canonical index mapping (KO/EN) |
| `src/domain/verse-cache.ts` | Caches fetched verses locally to reduce API calls |
| `src/ui/BibleSearchModal.ts` | Main verse search modal (SuggestModal) |
| `src/ui/BibleSettingsTab.ts` | Settings tab — source selection, template format |
| `src/ui/bible-suggestion.ts` | Suggestion rendering for search results |
| `src/ui/parse-modal-input.ts` | Parses user input into book/chapter/verse query |
| `src/ui/sources/bolls-api.ts` | Bolls.life REST API adapter |
| `src/ui/sources/bskorea-scraper.ts` | BSKorea HTML scraper adapter |
| `src/ui/sources/source-registry.ts` | Registry mapping source IDs to adapters |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `src/domain/` | Business logic — NO obsidian imports |
| `src/ui/` | Obsidian-dependent views, modals, settings |
| `src/ui/sources/` | Bible data source adapters (API/scraper) |
| `src/types/` | Pure type definitions |
| `src/utils/` | Pure utility functions |
| `src/shared/` | Boiler-template synced files — DO NOT EDIT |

## For AI Agents

### Working In This Directory
- 4-layer architecture: `domain/` must not import `obsidian`
- `source-registry.ts` is the adapter registry — add new Bible sources there, not inline
- `isDesktopOnly: false` — avoid Node.js-specific APIs; use `requestUrl` for HTTP (not `fetch` or `node:http`)
- `src/shared/` synced from `obsidian-boiler-template` — never edit directly

### Testing Requirements
```bash
pnpm run ci     # build + lint + test
pnpm run lint   # ESLint — 0 errors required
```

### Common Patterns
- New Bible source: implement adapter interface, register in `source-registry.ts`
- Verse insertion uses configurable template from settings — extend template logic in `domain/settings.ts`

## Dependencies

### Internal
- `obsidian-boiler-template` — source of truth for `src/shared/`

### External
- `obsidian` — Obsidian Plugin API
- Bolls.life API — remote Bible verse data
- BSKorea — Korean Bible HTML scraper
