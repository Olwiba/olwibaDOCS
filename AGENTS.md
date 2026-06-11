# AGENTS.md — olwibaDOCS

`@olwiba/docs` — published docs-shell package for the Olwiba ecosystem. Built on `@olwiba/cn`, consumed by `olwibaUI`, `genesis-render`, and downstream docs sites.

## Hard rules

1. **Never edit `@generated` files.** Most of `src/components/*` is synced from `olwibaCN/src/docs/components/*` and carries a `// @generated — synced from olwibaCN ... DO NOT EDIT.` banner. Fix bugs in olwibaCN first, then `bun run sync` here. Direct edits are overwritten on the next sync.
2. **Published packages only.** No `bun link`, no `link:`/`file:` deps. To pick up an upstream change: release the upstream package, then bump the version here.
3. **Releases are tag-driven.** The publish workflow runs when a `v*` tag matching `package.json` version is pushed. Never publish manually — use the Nexus root `release`/`pipeline` scripts.

## Ownership map

| Path | Owner | Notes |
|---|---|---|
| `src/components/*` (with `@generated` banner) | olwibaCN | Fix upstream, sync forward |
| `src/components/DocsProvider.tsx`, `src/lib/*`, `src/index.ts` | this repo | DOCS-owned logic |
| `scripts/sync-from-cn.ts` | this repo | Sync transforms + SYNC_MAP |
| `site/*`, `content/*` | this repo | Demo/docs site, not published |
| `src/project.config.ts` | this repo | Demo-site config (leaks into synced ActiveTheme default — known issue) |

## Commands

| Command | What |
|---|---|
| `bun run types:check` | fumadocs-mdx codegen + `tsc --noEmit` — the verification gate; run before claiming work done |
| `bun run build` | tsup package build |
| `bun run web:dev` / `web:build` | Demo site (prefer the user starts dev servers) |
| `bun run sync` | Pull docs shell sources from olwibaCN (requires sibling olwibaCN checkout; exits non-zero on missing files) |
| `bun run sync:build` | sync + types:check + build |
| `bun run iso:generate` | Regenerate homepage preview PNGs (currently imports olwibaDX source via sibling path — monorepo only) |

No test suite exists yet; `types:check` + `build` is the only gate.

## Workflow for a docs-shell fix

1. Confirm the file is `@generated` → make the fix in `olwibaCN/src/docs/components/*`.
2. Release `@olwiba/cn` (Nexus `release --project=olwibaCN` or `pipeline`).
3. Here: `bun run sync && bun run types:check && bun run build`.
4. Release `@olwiba/docs`, then update downstream consumers (`olwibaUI` ambient shim at `src/types/external-packages.d.ts` may need updating when exports change).

## Test ownership (when tests land)

- Shell UI component behavior → olwibaCN.
- This repo → `src/lib/*` units, sync-transform fixtures, published-entry smoke tests (`.`, `./source`, `./mdx`, `./server`, `./themes`).
