<div align="center">
  <img src="src/assets/general/svg/RSVLogo.svg" height="80" />
  <h1 align="center"><a href="https://radschnellverbindungen.info/">Radschnellverbindungen.info</a></h1>
</div>

This site show's general information about Radschnellverbindungen (cycle highways) in Germany and specific about specific highways which are planned or build.

## 💾 Data

Steckbrief editorial content is managed in **Keystatic** (`/keystatic` → Steckbriefe). Route geometry comes from **Trassenscout** when project slugs are configured on a Steckbrief.

See **[docs/DATA.md](./docs/DATA.md)** for what to edit where, loader architecture, and Trassenscout conventions.

## 🧑‍💻 Developing

If you found any bugs feel free to create an issue.

### Getting Started

For starting developing, the following steps could be helpful for getting started:

- Install [Bun](https://bun.sh/docs/installation) (see [`.bun-version`](./.bun-version) for the pinned version)
- Install dependencies: `bun install`
- Start the Astro dev server: `bun run dev` (or `bun start`)
- Use `bun run` to see a list of commands

We use [oxlint](https://oxc.rs/docs/guide/usage/linter.html) and [oxfmt](https://oxc.rs/docs/guide/usage/formatter.html) for linting and formatting (`src` and `keystatic`), and [React Compiler](https://react.dev/learn/react-compiler) via `babel-plugin-react-compiler` in the Astro React integration. Husky runs `bun run check` on pre-push (type-check, format, lint). `.astro` files are linted but not formatted yet (Oxfmt Astro support is pending).

If pre-push hooks fail in a GUI Git client, ensure `bun` is on your `PATH`. See [Husky troubleshooting](https://typicode.github.io/husky/#/?id=command-not-found)

Setup your `.env.development` file, for which you can use `.env.defaults` as a start.

For production you will also need a `.env.production` file. Otherwise the modules using the env variables, will not work.

## Blog

We use [Keystatic](https://keystatic.com/docs/introduction) for the blog on `/planung` and `/kommunikation`.

* [Keystatic CMS](https://rsv-info-cms.netlify.app/keystatic)
* [Preview](https://rsv-info-cms.netlify.app/)
* [Netlify-Admin](https://app.netlify.com/projects/rsv-info-cms/overview)

Dev: [CMS Admin UI](http://127.0.0.1:4321/keystatic)

## License

This project has different licenses. The code is licensed under the AGPL-3.0 License - see the [LICENSE.md](LICENSE.md) file for more information.
It contains dependencies which have different Licenses, see [`package.json`](./package.json).
