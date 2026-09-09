import { defineConfig } from 'oxfmt'

// Keep ignorePatterns in sync with oxlint.config.mjs where they overlap.
// oxfmt cannot format .astro yet. Do not rewrite Keystatic markdown (.md / .mdx).
export default defineConfig({
  useTabs: false,
  tabWidth: 2,
  printWidth: 100,
  singleQuote: true,
  jsxSingleQuote: false,
  quoteProps: 'as-needed',
  trailingComma: 'all',
  semi: false,
  arrowParens: 'always',
  bracketSameLine: false,
  bracketSpacing: true,
  endOfLine: 'lf',
  sortImports: {
    newlinesBetween: false,
  },
  sortTailwindcss: {
    stylesheet: 'src/layouts/base.css',
    functions: ['twMerge', 'twJoin', 'clsx'],
    attributes: ['className', 'class', 'class:list'],
  },
  sortPackageJson: true,
  ignorePatterns: [
    '.agents/**',
    '.cursor/**',
    '.output/**',
    'playwright-report/**',
    'test-results/**',
    '**/*.astro',
    '**/*.md',
    '**/*.mdx',
    // IONOS Deploy Now — do not rewrite generated/managed workflow files
    '.github/workflows/deploy-to-ionos.yaml',
    '.github/workflows/rsv-info-build.yaml',
    '.github/workflows/rsv-info-orchestration.yaml',
  ],
})
