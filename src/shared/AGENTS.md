<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-25 | Updated: 2026-03-25 -->

# src/shared/ — Boiler-Template Synced Code

## Purpose

Shared deterministic code synced from `obsidian-boiler-template`. **Read-only — do not edit.** Shared patterns are proven in the boiler template, then distributed to all plugins via a sync engine.

When a pattern is proven or improved, it is:
1. Updated in `obsidian-boiler-template` (source of truth).
2. Synced to all plugins via `tooling/sync/`.
3. Plugins import the synced version without modification.

## Key Files

| File | Purpose |
|------|---------|
| `plugin-logger.ts` | Structured logging with plugin ID prefix and error tracking |
| `plugin-notices.ts` | Templated notice system with mute state persistence |
| `settings-migration.ts` | Settings schema versioning and migration helpers |
| `debounce-controller.ts` | Debounce utility for input handlers (not currently used; available for future features) |

## For AI Agents

- **obsidian-developer**: Uses shared utilities; does NOT modify them.
- **obsidian-qa**: Verifies imports are correct; suggests improvements upstream in boiler template.
- All agents: If a shared pattern needs improvement, submit a PR to `obsidian-boiler-template`, then sync.

## Dependencies

- **Inbound**: All layers import from `shared/`.
- **Outbound**: `obsidian`, `types/`.
- **External**: None (zero external package dependencies).

## Key Utilities

### PluginLogger

Provides structured error logging:

```typescript
const logger = new PluginLogger('plugin-name')
logger.error('Message', err)
logger.warn('Warning message')
```

Outputs: `[PluginName] Error: Message | {error details}`.

### PluginNotices

Templated notice system with user mute state:

```typescript
const notices = new PluginNotices(plugin, {
  fetch_failed: { template: 'Failed to fetch {{data}}: {{error}}', timeout: 6000 },
}, 'PluginName')

notices.show('fetch_failed', { data: 'John 3:16', error: 'Network error' })
```

Persists mute state in settings so users can silence repeated notices.

### settings-migration.ts

Helpers for schema versioning:

```typescript
const { data, changed } = migrateSettings(raw, [
  (data) => { /* migration 1 */ },
  (data) => { /* migration 2 */ },
])
```

Runs migrations in sequence, tracks if changes occurred for persistence.

## Sync Mechanism

- **Sync engine**: `tooling/sync/index.mjs` — copies files from boiler template.
- **Sync check**: ESLint rule prevents divergence (checksum validation).
- **Update process**: Run sync, verify no local changes, commit bump.

**Never manually edit shared files.** If a change is needed:

1. Update the source in `obsidian-boiler-template`.
2. Run sync in this plugin.
3. Commit the synced version.

## Testing

Shared code is tested in `obsidian-boiler-template`; this plugin inherits those tests. Integration tests verify correct usage.
