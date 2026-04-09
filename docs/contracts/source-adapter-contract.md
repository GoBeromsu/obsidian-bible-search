# Source Adapter Contract

> This document defines the repo-local contract for Bible source adapters.

## Purpose

`obsidian-bible-search` depends on multiple data sources with different failure modes.

This contract makes those integration assumptions explicit without centralizing the implementation in the workspace.

## Core Interface

Each source must implement:

```ts
interface BibleSource {
  fetchChapter(versionCode: string, bookNr: number, chapter: number): Promise<VerseData[]>
}
```

Expected result shape:

```ts
interface VerseData {
  chapter: number
  verse: number
  text: string
}
```

## Registry Rule

All version routing must stay explicit in `src/ui/sources/source-registry.ts`.

Do not inline version/source branching inside modal or formatting code.

Why:

- source behavior remains discoverable
- new source support has one registration point
- version-specific assumptions stay localized

## Contract Expectations

### 1. Chapter fetch semantics

`fetchChapter(...)` must:

- return verses for exactly one chapter
- preserve verse numbering
- return normalized text without source-specific markup artifacts
- throw when the source cannot provide trustworthy content

### 2. Parse-at-the-edge

Source-specific response parsing belongs inside the adapter or a local helper directly owned by the adapter.

Examples:

- `parseBollsResponse(...)`
- `parseVerses(...)` for BSKorea HTML

The rest of the plugin should receive normalized `VerseData[]`, not raw source payloads.

### 3. Retry and timeout policy

Network resilience belongs at the adapter edge through `resilientFetch(...)`.

Adapters may define:

- headers
- validation strategy
- source-specific request URLs

But they should not bypass the shared local fetch policy lightly.

### 4. Validation strategy

Each adapter must prove source health with a source-appropriate validation rule.

Current examples:

- Bolls: JSON array with verse field
- BSKorea: HTML contains `#tdBible1`

If validation fails, the adapter should fail fast rather than silently return bad data.

## Expected Failure Buckets

Every adapter change should reason about:

1. transport timeout
2. HTTP failure
3. validation failure
4. parser drift
5. empty or malformed verse data

## Review Checklist

Before accepting a source-adapter change, confirm:

- [ ] registry wiring remains explicit
- [ ] source-specific assumptions are documented
- [ ] output is normalized to `VerseData[]`
- [ ] retry/timeout policy still applies at the edge
- [ ] parser failures do not silently degrade into misleading success

## Relationship to the Workspace Contract

This contract is **repo-local by default**.

What the workspace may borrow:

- the idea of explicit adapter contracts
- edge validation
- parse-at-the-edge discipline

What the workspace must not assume:

- these exact source APIs
- these exact validation selectors
- this repo's runtime integration details
