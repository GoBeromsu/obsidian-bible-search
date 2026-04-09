<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-25 | Updated: 2026-03-25 -->

# src/ui/ — User Interface & Obsidian Integration

## Purpose

All Obsidian-dependent code — modals, settings tabs, commands, and Bible data source adapters. Handles I/O, user interaction, and integration with the Obsidian API.

## Key Files

| File | Purpose |
|------|---------|
| `BibleSearchModal.ts` | Main search interface — fuzzy book matching, verse input parsing, formatting, insertion into note |
| `BibleSettingsTab.ts` | Settings UI — version selection, format template editor, cache settings |
| `bible-suggestion.ts` | Suggestion item rendering for modal (book name, chapter preview) |
| `parse-modal-input.ts` | Parse user input in modal (book name + chapter:verse syntax) |

## Subdirectories

| Directory | Purpose | Parent AGENTS.md |
|-----------|---------|-----------------|
| `sources/` | Bible data source adapters (bskorea.or.kr, bolls.life) — encapsulates web scraping and API calls | `AGENTS.md` |

## For AI Agents

- **obsidian-ui**: Owns all UI implementation — modal design, settings layout, input parsing, user feedback.
- **obsidian-developer**: Implements domain integration — how modal calls cache, applies settings, formats output.
- **obsidian-qa**: Screenshots, DOM inspection, user interaction testing.

## Dependencies

- **Inbound**: `main.ts` opens modal and wires settings/cache.
- **Outbound**: `domain/` (cache, settings, book map), `utils/` (parsers, formatters), `types/`, sibling `ui/` helpers (notices, logger), `obsidian`.
- **External**: `obsidian` (SuggestModal, Editor, App, requestUrl).

## Key Components

### BibleSearchModal

- Extends `obsidian.SuggestModal<BibleSuggestion>`.
- Fuzzy-matches books while user types.
- On selection, parses chapter:verse input and fetches verses.
- Applies format template and inserts into editor.
- Shows error notices for failed fetches.

### BibleSettingsTab

- Extends `obsidian.PluginSettingTab`.
- Dropdowns for Korean/English Bible versions.
- Textarea for custom format template (with preview).
- Toggles for cache and verse numbers.
- Text input for cache TTL (minutes).

### parse-modal-input

Splits user input (e.g., "Matthew 3:16-18") into:
- Book name (fuzzy-matched via `findBook`).
- Chapter and verse range (parsed from regex).

## Testing

Integration tests in `test/`:
- `parse-modal-input.test.ts` — parsing edge cases.
- UI components tested via Obsidian CLI mocks (see `test/mocks/obsidian.ts`).
