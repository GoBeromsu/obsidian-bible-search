# Bible Search for Obsidian

Search Korean and English Bible verses and insert them directly into your notes with a configurable template format.

> **This repo is private** due to copyright concerns with Bible text data. It is NOT published to the Obsidian community plugin directory.

## Features

- **Verse search modal** -- search by book, chapter, and verse range in Korean or English
- **Dual-language output** -- insert Korean and English translations side by side
- **Configurable templates** -- customize the output format using template variables (`{bookKo}`, `{bookEn}`, `{chapter}`, `{range}`, `{versesKo}`, `{versesEn}`)
- **Multiple Bible versions** -- supports Korean versions (GAE, etc.) and English versions (ESV, etc.)
- **Verse caching** -- fetched verses are cached in memory to reduce repeated network requests
- **Verse numbers** -- optionally include verse numbers in the output

## Installation

Since the repo is private, BRAT cannot fetch releases without a PAT. Use one of:

### Direct Copy (Recommended)

Build locally and copy to your vault:

```bash
pnpm build
cp main.js manifest.json "$OBSIDIAN_VAULT_PATH/.obsidian/plugins/obsidian-bible-search/"
```

Reload Obsidian or run `obsidian plugin:reload id=obsidian-bible-search`.

### GitHub Release Download

Download from the latest GitHub release via `gh`:

```bash
gh release download --repo GoBeromsu/obsidian-bible-search \
  --dir "$OBSIDIAN_VAULT_PATH/.obsidian/plugins/obsidian-bible-search/" \
  --pattern 'main.js' --pattern 'manifest.json' --clobber
```

## Usage

1. Open a note and place your cursor where you want to insert a verse
2. Open the Command Palette (Cmd/Ctrl + P) and run **Bible Search: Search verse**
3. Type a book name, chapter, and verse range (e.g. "John 3:16" or "요한복음 3:16-18")
4. Select the verse and it will be inserted at the cursor using your configured template

## Commands

| Command | Description |
|---------|-------------|
| Bible Search: Search verse | Open the verse search modal and insert the selected verse |

## Settings

| Setting | Default | Description |
|---------|---------|-------------|
| Korean version | `GAE` | Default Korean Bible translation |
| English version | `ESV` | Default English Bible translation |
| Format template | blockquote | Template for inserted verses (supports `{bookKo}`, `{bookEn}`, `{chapter}`, `{range}`, `{versesKo}`, `{versesEn}`) |
| Callout type | `bible` | Callout type when using callout format |
| Show verse numbers | `true` | Include verse numbers in the output |
| Cache enabled | `true` | Cache fetched verses in memory |
| Cache TTL | `30 min` | How long cached verses are kept |

## Tech Stack

| Category | Technology |
|----------|------------|
| Platform | Obsidian Plugin API |
| Language | TypeScript 5 |
| Bundler | esbuild |
| Data sources | Bolls API, BSKorea scraper |
| Testing | Vitest |
| Linting | ESLint + Husky + lint-staged |

## Project Structure

```
obsidian-bible-search/
├── src/
│   ├── main.ts              # Plugin entry point (BibleSearchPlugin)
│   ├── plugin-settings.ts   # Settings interface + defaults
│   ├── cache/               # Verse cache (in-memory with TTL)
│   ├── data/                # Bible book data and mappings
│   ├── sources/             # Data source adapters (Bolls API, BSKorea scraper)
│   ├── ui/                  # Search modal, settings tab, suggestion renderer
│   ├── utils/               # Utility functions
│   └── shared/              # Shared utilities (plugin-logger, plugin-notices)
├── scripts/                 # dev.mjs, version.mjs, release.mjs
├── boiler.config.mjs        # Per-repo config
└── manifest.json            # Obsidian plugin manifest
```

## Development

```bash
pnpm install
pnpm dev          # vault selection + esbuild watch + hot reload
pnpm build        # tsc type-check + production build
pnpm test         # Vitest unit tests
pnpm lint         # ESLint
pnpm run ci       # build + lint + test
```

## License

MIT
