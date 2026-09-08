---
description: package.json scripts naming — colons only for parallel/sequential groups
globs: **/package.json
alwaysApply: false
---

<!-- Copy to .cursor/rules/package-json-scripts.md on scaffold — @see tech-stack references/package-json-scripts.md -->

# package.json script names

Use `:` only for **step scripts** that belong to a group run via `bun run --parallel` or `bun run --sequential` with a glob (`<group>:*`).

## Colon groups (`<group>:<step>`)

- Parent script orchestrates: `bun run --parallel lint:*`, `bun run --sequential type-check:*`
- Step names use the group prefix: `type-check:astro`, `lint:oxlint`
- Order steps with numeric prefixes when sequence matters

## Standalone scripts (no `:`)

One-off commands run directly — use kebab-case, no colon:

- `type-check`, `lint-check`, `format-check`, `check-pre-push`

## Verify scripts

| Script | Role |
| --- | --- |
| `check` | finish-work — `--parallel type-check lint format test-run knip-warn` |
| `check-ci` | Read-only CI — `--parallel type-check lint-check format-check test-run` |
| `check-pre-push` | husky — parallel leaves including strict `knip` |

This is an Astro site: `type-check` runs `type-check:astro` (`astro check`) then `type-check:tsc`. Keep TypeScript 6 until Astro supports TypeScript 7.

## Prefer parallel groups over `&&`

Do **not** chain verify scripts with `&&` (e.g. `check && knip`). List leaf scripts in one `--parallel` orchestrator, or use `<group>:*` when a step has multiple paths.

Use `&&` only inside a single step when the shell must run multiple commands as one atomic action (e.g. `build:netlify`, `generate-types`).
