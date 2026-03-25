<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-25 | Updated: 2026-03-25 -->

# tooling/shared/ — Shared Build Configuration

## Purpose

Build configuration files synced from `obsidian-boiler-template`. **Read-only — do not edit.** Ensures all plugins use consistent ESLint rules, TypeScript settings, and build patterns.

## Key Files

| File | Purpose |
|------|---------|
| `dev.mjs` | Dev server hot reload implementation (copied from boiler template) |
| `version.mjs` | Version bumping script (copied from boiler template) |
| (eslint.base.js, tsconfig.base.json, etc. may be synced here in future) | Shared linting and compilation rules |

## For AI Agents

- **obsidian-developer**: Uses these configs but does NOT modify them.
- **obsidian-qa**: Ensures ESLint/TypeScript respect these shared rules (esp. `no-restricted-imports` for layer boundaries).

## Dependencies

- **Inbound**: Root `package.json` and ESLint config extend from here.
- **Outbound**: None (configs only).
- **Sync source**: `obsidian-boiler-template` (submodule or remote).

## Sync Process

**Never edit files in this directory.** To update:

1. Update the source in `obsidian-boiler-template`.
2. Run `pnpm sync:fix` in this plugin.
3. Verify no local changes with `pnpm sync:check`.
4. Commit the synced version: `git add tooling/shared && git commit -m "chore: sync tooling from boiler-template"`

## Key Configurations

### ESLint (eslint.base.js)

If synced, enforces:
- `no-restricted-imports`: Prevents `obsidian` imports in `domain/`, `types/`, `utils/`.
- Other shared rules for code quality.

### TypeScript (tsconfig.base.json)

If synced, standardizes:
- Compiler options (strict, target, module format).
- Path aliases.

## Testing

Shared config is tested in `obsidian-boiler-template`; this plugin inherits those standards via sync. Run `pnpm lint` to verify compliance.
