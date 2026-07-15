import { homedir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import mdx from '@astrojs/mdx'
import netlify from '@astrojs/netlify'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import keystatic from '@keystatic/astro'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, envField } from 'astro/config'

const appRoot = fileURLToPath(new URL('.', import.meta.url))

// ABOUT:
// We have to fetch settings from `.env`
// Which we have to do manually, see https://docs.astro.build/en/guides/configuring-astro/#environment-variables
//
// USAGE:
// `bun run dev` uses server mode and keystatic()
// `bun run build` (server) is based on .env and has different settings for Netlify (CMS/Keystatic) vs. IONOS (Static site)
// `bun run build:local && bun run preview` overwrites the .env settings to have a local test case for what is on IONOS
import { loadEnv } from 'vite'
const { ASTRO_OUTPUT_MODE, ASTRO_USE_NETLIFY_ADAPTER } = loadEnv(
  process.env.NODE_ENV,
  process.cwd(),
  '',
)

// CONFIG:
// https://astro.build/config
export default defineConfig({
  site: 'https://radschnellverbindungen.info',
  integrations: [
    ASTRO_OUTPUT_MODE === 'static' ? undefined : keystatic(),
    react({
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
    mdx(),
    sitemap(), // We don't exclute inactive pages but rely on the per page `noindex`
  ],
  // On Netlify and during development we use `server`, on Github Pages we usd `static`.
  // Using static makes sure features like Astros redirecting work as expected.
  // Docs https://docs.astro.build/en/basics/rendering-modes/
  output: ASTRO_OUTPUT_MODE,
  adapter: ASTRO_USE_NETLIFY_ADAPTER === 'true' ? netlify() : undefined,
  redirects: {
    'abstimmungen/abstimmungsprozesse':
      '/kommunikation/radschnellwegeplanung-als-zusammenspiel-vieler-akteur-innen',
  },
  // Learn more at https://github.com/withastro/astro/issues/12532
  trailingSlash: 'never',
  vite: {
    plugins: [tailwindcss()],
    server: {
      // Bun globalStore (bunfig.toml) symlinks realpath outside the project (~/.bun/install/cache/links/).
      // Extend (not replace) Vite's default fs.allow — setting allow alone drops the project root.
      // Needed e.g. for @fontsource/overpass .woff2 files served from the global store in dev.
      // @see https://bun.com/docs/pm/global-store
      // @see https://vite.dev/config/server-options.html#server-fs-allow
      fs: {
        allow: [appRoot, join(homedir(), '.bun/install/cache/links')],
      },
    },
  },
  env: {
    schema: {
      ASTRO_OUTPUT_MODE: envField.enum({
        values: ['static', 'server'],
        access: 'secret',
        context: 'server',
        optional: false,
      }),
      ASTRO_USE_NETLIFY_ADAPTER: envField.boolean({
        access: 'secret',
        context: 'server',
        optional: false,
      }),
      KEYSTATIC_STORAGE_KIND: envField.enum({
        values: ['local', 'github'],
        access: 'public',
        context: 'client',
        optional: false,
      }),
      ASTRO_ENV: envField.enum({
        values: ['development', 'staging', 'production'],
        access: 'public',
        context: 'client',
        optional: false,
      }),
    },
  },
})
