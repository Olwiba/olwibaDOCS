# Contributing

Thanks for your interest in contributing to `@olwiba/docs`. We're happy to have you here.

Please take a moment to review this document before submitting your first pull request. We also strongly recommend that you check for open issues and pull requests to see if someone else is working on something similar.

If you need any help, feel free to reach out to [@Olwiba](https://github.com/Olwiba).

## About this repository

This repository ships a single npm package: `@olwiba/docs`. It contains the docs framework — layouts, search, MDX helpers, and TanStack Start docs utilities built on top of `@olwiba/cn`.

- We use [Bun](https://bun.sh) for package management and scripts.
- We use [tsup](https://tsup.egoist.dev) to build the package.
- We use [Vite](https://vite.dev) + [TanStack Start](https://tanstack.com/start) for the docs site.
- We use [Fumadocs](https://fumadocs.dev) for documentation rendering.
- We use tag-driven GitHub Actions workflows for releases.

## Structure

This repository is structured as follows:

```
src
├── assets
├── components
├── demos
├── hooks
├── lib
├── styles
└── types
scripts
└── sync-from-cn.ts
```

| Path                       | Description                                                            |
| -------------------------- | ---------------------------------------------------------------------- |
| `src/components/`          | Docs shell components (DocsLayout, DocsSidebar, etc.).                 |
| `src/hooks/`               | Shared React hooks for docs interactions.                              |
| `src/lib/`                 | Utilities for MDX, search, and navigation.                             |
| `src/styles/`              | Exported CSS entrypoints.                                              |
| `scripts/sync-from-cn.ts`  | Syncs docs shell sources from `olwibaCN/src/docs/`.                    |

## Upstream Source of Truth

Docs shell primitives are authored in [`olwibaCN`](https://github.com/Olwiba/olwibaCN) under `src/docs/components/` and synced into this repository via `scripts/sync-from-cn.ts`.

If you find a bug in a docs shell primitive, please consider whether the fix belongs in `olwibaCN` first. Direct edits to synced files in this repo will be overwritten on the next sync.

## Development

### Fork this repo

You can fork this repo by clicking the fork button in the top right corner of this page.

### Clone on your local machine

```bash
git clone https://github.com/your-username/olwibaDOCS.git
```

### Navigate to project directory

```bash
cd olwibaDOCS
```

### Create a new branch

```bash
git checkout -b my-new-branch
```

### Install dependencies

```bash
bun install
```

### Run the docs site

```bash
bun run web:dev
```

### Build the package

```bash
bun run build
```

### Sync from olwibaCN

```bash
bun run sync
```

### Type-check

```bash
bun run types:check
```

## Commit Convention

Before you create a Pull Request, please check whether your commits comply with
the commit conventions used in this repository.

When you create a commit we kindly ask you to follow the convention
`category(scope or module): message` in your commit message while using one of
the following categories:

- `feat / feature`: all changes that introduce completely new code or new
  features
- `fix`: changes that fix a bug (ideally you will additionally reference an
  issue if present)
- `refactor`: any code related change that is not a fix nor a feature
- `docs`: changing existing or creating new documentation (i.e. README, docs for
  usage of a lib or cli usage)
- `build`: all changes regarding the build of the software, changes to
  dependencies or the addition of new dependencies
- `test`: all changes regarding tests (adding new tests or changing existing
  ones)
- `ci`: all changes regarding the configuration of continuous integration (i.e.
  github actions, ci system)
- `chore`: all changes to the repository that do not fit into any of the above
  categories

  e.g. `feat(sidebar): add collapsible sections`

If you are interested in the detailed specification you can visit
https://www.conventionalcommits.org/ or check out the
[Angular Commit Message Guidelines](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines).

## Requests for new features

If you have a request for a new feature, please open a discussion or issue on GitHub. We'll be happy to help you out.

## Releases

Releases are tag-driven. The publish workflow runs automatically when a `v*` tag matching the `package.json` version is pushed.
