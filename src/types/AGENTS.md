<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-25 | Updated: 2026-03-25 -->

# src/types/ — Type Definitions

## Purpose

Pure type definitions and interfaces. **No Obsidian imports allowed.** Defines contracts between domain and UI layers without introducing external dependencies.

## Key Files

| File | Purpose |
|------|---------|
| `index.ts` | Minimal interface set — `VerseData`, `BibleSource` |

## For AI Agents

- **obsidian-developer**: Adds new interfaces when introducing new domain concepts (e.g., if adding a translation quality rating).
- **obsidian-qa**: Verifies no Obsidian imports, ensures interfaces are pure data structures.

## Dependencies

- **Inbound**: All layers import from `types/`.
- **Outbound**: None (zero external dependencies).
- **External**: None.

## Key Types

### VerseData

```typescript
interface VerseData {
  chapter: number
  verse: number
  text: string
}
```

Represents a single Bible verse. Used by cache and source adapters.

### BibleSource

```typescript
interface BibleSource {
  fetchChapter(versionCode: string, bookNr: number, chapter: number): Promise<VerseData[]>
}
```

Contract for Bible data sources (bolls.life, bskorea). Enables pluggable adapters without tying domain to specific APIs.

## Testing

Types are validated at compile-time by TypeScript. No unit tests needed. ESLint ensures no Obsidian imports.
