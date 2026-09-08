<div align="center">
  <img src="src/assets/general/svg/RSVLogo.svg" height="80" />
  <h1 align="center"><a href="https://radschnellverbindungen.info/">Radschnellverbindungen.info</a></h1>
</div>

This site explains Radschnellverbindungen (cycle highways) in Germany and publishes a Steckbrief (fact sheet) for each planned or built route.

## Data

Editors maintain Steckbrief text in Keystatic (`/keystatic` → Steckbriefe). Route geometry comes from Trassenscout and is checked in under `src/data/trassenscout/`.

[docs/DATA.md](./docs/DATA.md) explains what to edit where, how the two sources are joined at build time, and how the Trassenscout sync runs (on every Netlify build, and as a weekly pull request for production).

## Developing

Found a bug? Open an issue.

### Getting started

- Install [Bun](https://bun.sh/docs/installation). `package.json` pins `bun@1.4.0` in `packageManager`; `engines` requires 1.3.14 or newer.
- Install dependencies: `bun install`
- Copy `.env.example.local` to `.env`. `.env.example.netlify` and `.env.example.ionos` show the values used on Netlify and on IONOS.
- Start the Astro dev server: `bun run dev` (or `bun start`)
- Run `bun run` to list all scripts. Naming rules are in [.cursor/rules/package-json-scripts.md](./.cursor/rules/package-json-scripts.md).

Dev: [Keystatic admin UI](http://127.0.0.1:4321/keystatic)

### Checks

- `bun run check` runs type check, lint (with autofix), format, tests and a non-blocking knip in parallel. Run it before committing.
- `bun run check-ci` is the read-only variant that CI runs.
- Husky runs `bun run check-pre-push` (same as `check`, but knip fails the push) on `git push`. If the hook fails in a GUI Git client, `bun` is probably missing from that client's `PATH`. See [Husky troubleshooting](https://typicode.github.io/husky/#/?id=command-not-found).

### Tooling notes

- Lint and format: [oxlint](https://oxc.rs/docs/guide/usage/linter.html) and [oxfmt](https://oxc.rs/docs/guide/usage/formatter.html). `.astro` files are linted but not formatted; oxfmt does not support Astro yet.
- [React Compiler](https://react.dev/learn/react-compiler) runs through `babel-plugin-react-compiler` in the Astro React integration (see `astro.config.mjs`). The faster Oxc-based compiler needs `@vitejs/plugin-react` 6.1 or newer; `@astrojs/react` still ships 5.x.
- TypeScript stays on 6.x until `astro check` supports TypeScript 7.

## Blog

The blog on `/planung` and `/kommunikation` is edited in [Keystatic](https://keystatic.com/docs/introduction).

- [Keystatic CMS](https://rsv-info-cms.netlify.app/keystatic)
- [Preview](https://rsv-info-cms.netlify.app/)
- [Netlify admin](https://app.netlify.com/projects/rsv-info-cms/overview)

## License

The code is licensed under AGPL-3.0, see [LICENSE](LICENSE). Dependencies have their own licenses, see [`package.json`](./package.json).
