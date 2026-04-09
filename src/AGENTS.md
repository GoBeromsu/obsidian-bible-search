<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-25 | Updated: 2026-03-25 -->

# src/ — Source Code Organization

## Purpose

Container for the main plugin source code organized into four logical layers (domain, ui, types, utils) plus the composition root (main.ts). Follows strict dependency direction to keep business logic testable and UI concerns isolated from domain logic.

## Key Files

| File | Purpose |
|------|---------|
| `main.ts` | Plugin composition root — wires domain, ui, cache, settings, and notices |

## Subdirectories

| Directory | Purpose | Parent AGENTS.md |
|-----------|---------|-----------------|
| `domain/` | Business logic — Bible data models, settings, verse caching (no obsidian imports) | `AGENTS.md` |
| `ui/` | Obsidian-dependent UI — modals, settings tabs, search interfaces | `AGENTS.md` |
| `types/` | Pure type definitions — interfaces, no obsidian imports | `AGENTS.md` |
| `utils/` | Pure utility functions — parsing, formatting, templates (zero external dependencies) | `AGENTS.md` |

## For AI Agents

- **obsidian-developer**: Owns `main.ts`, `domain/`, `types/`, `utils/`, and understands wiring between layers.
- **obsidian-ui**: Owns `ui/` implementation — modals, settings, commands, styling.
- **obsidian-qa**: Reviews all layers — runs type checks, verifies imports respect layer rules, validates dependency direction.

## Dependencies

- **Inbound**: None (top-level source directory).
- **Outbound**: External packages (`obsidian`, `viem`, `isomorphic-fetch`), tooling.
- **Cross-layer imports**: Strictly one-way (see layer rules below).

## Layer Dependency Rules

```
utils/  ──┐
types/  ──┼── domain/ ── ui/ ── main.ts
          └──────────────┘
```

- `utils/` imports **nothing** from project.
- `types/` imports **nothing** from project.
- `domain/` imports from `utils/` and `types/` only — **never** `obsidian`.
- `ui/` imports from `domain/`, `utils/`, `types/`, and `obsidian`.
- `main.ts` (composition root) imports from all layers.

**ESLint enforcement**: `eslint.base.js` prevents `domain/`, `types/`, and `utils/` from importing `obsidian`. If code needs Obsidian API, it belongs in `ui/`, not `domain/`.

## Testing Strategy

- **domain/**: Unit tests with simple stubs (no mocks needed).
- **ui/**: Integration tests with mocked `obsidian` module (test/mocks/obsidian.ts).
- **utils/**: Unit tests, no external dependencies.
