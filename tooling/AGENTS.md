<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-25 | Updated: 2026-03-25 -->

# tooling/ — Build & Development Tooling

## Purpose

Development and build infrastructure — version management, dev server hot reload, shared configuration sync from boiler template.

## Key Files

| File | Purpose |
|------|---------|
| `shared/version.mjs` | Version bumping script for `pnpm version` (updates package.json and manifest.json) |
| `shared/dev.mjs` | Dev server setup — hot reload socket, file watcher integration |
| `sync/index.mjs` | Syncs shared code from `obsidian-boiler-template` to `src/shared/` and `tooling/shared/` |

## Subdirectories

| Directory | Purpose | Parent AGENTS.md |
|-----------|---------|-----------------|
| `shared/` | Synced tooling config from boiler template (read-only) | `AGENTS.md` |

## For AI Agents

- **obsidian-developer**: Uses tooling during build/dev; does not modify tooling scripts.
- **obsidian-qa**: Verifies build and dev commands work correctly.

## Dependencies

- **Inbound**: `package.json` build/dev scripts invoke these.
- **Outbound**: `../../tooling/shared/eslint.base.js` (ESLint config), `package.json`, `manifest.json`.
- **External**: Node.js fs, path, and build tools (esbuild, tsc).

## Key Scripts

### version.mjs

Called by `pnpm version X` (patch/minor/major):

```bash
pnpm version patch
```

- Updates `package.json` version.
- Updates `manifest.json` version (parsed, modified, written).
- Called via `scripts.version` in package.json.

**Note**: Post-version hook runs `git push && git push --tags`, triggering the CI release workflow.

### dev.mjs

Dev server setup (hot reload):

```bash
pnpm dev
```

- Watches source files.
- Rebuilds on change.
- Notifies `.obsidian/plugins/{plugin-id}/.hotreload` (Obsidian CLI watches this).
- Obsidian reloads plugin automatically.

Requires `.hotreload` marker file in vault plugin directory.

### sync/index.mjs

Syncs boiler template files:

```bash
pnpm sync:check  # Verify no local changes
pnpm sync:fix    # Pull latest from boiler, apply to this plugin
```

- Pulls from `obsidian-boiler-template` (submodule or remote).
- Copies to `src/shared/` and `tooling/shared/`.
- Verifies checksums (ESLint rule `boiler-sync:check`).

## Release Workflow

Full release cycle:

```bash
pnpm run ci           # Build + lint + test
pnpm release:patch    # Bumps version, pushes tag
# .github/workflows/release.yml builds and publishes
```

**Important**: Never run `git tag`, `git push --tags`, or `npm publish` directly. Use `pnpm release:*`.

## Testing

Tooling is verified by CI:
- Build succeeds (`pnpm build`).
- Tests pass (`pnpm test`).
- Lint passes (`pnpm lint`).
