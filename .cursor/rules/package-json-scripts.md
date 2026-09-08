---
description: package.json scripts naming. Colons only for parallel/sequential groups
globs: **/package.json
alwaysApply: false
---

# package.json script names

Use `:` only for **step scripts** that belong to a group run via `bun run --parallel` or `bun run --sequential` with a glob (`<group>:*`).

## Colon groups (`<group>:<step>`)

- Parent script orchestrates: `bun run --parallel lint:*`, `bun run --sequential type-check:*`
- Step names use the group prefix: `type-check:astro`, `lint:oxlint`
- Order steps with numeric prefixes when sequence matters

## Standalone scripts (no `:`)

One-off commands run directly. Use kebab-case, no colon:

- `type-check`, `lint-check`, `format-check`, `check-pre-push`

## Verify scripts

| Script | Role |
| --- | --- |
| `check` | Local, before commit. `--parallel type-check lint format test-run knip-warn` |
| `check-ci` | Read-only, run by CI. `--parallel type-check lint-check format-check test-run` |
| `check-pre-push` | Husky pre-push. Same leaves as `check` but strict `knip` |

`type-check` runs `type-check:astro` (`astro check`) and then `type-check:tsc` with `--sequential`. Keep TypeScript 6 until `astro check` supports TypeScript 7.

`lint` and `lint-check` each have two steps: oxlint and `lint:steckbriefe` / `lint-check:steckbriefe` (guards that pages load Steckbriefe only through `getPublishedSteckbriefe()`).

## Prefer parallel groups over `&&`

Do not chain verify scripts with `&&` (e.g. `check && knip`). List leaf scripts in one `--parallel` orchestrator, or use `<group>:*` when a step has multiple paths.

Use `&&` only inside a single step when the shell must run multiple commands as one action (e.g. `build:netlify`, `generate-types`).

## Existing scripts that break the colon rule

These predate the rule and are not run through `<group>:*`: `build:netlify`, `build:local`, `generate-types:*`, `updatePackages:*`, `export:steckbriefe`, `trassenscout:*`, `generate:map-images`, `bleach:*`. Do not add more of this kind. Renaming them changes Netlify config and the weekly sync workflow, so do it in a dedicated change.
