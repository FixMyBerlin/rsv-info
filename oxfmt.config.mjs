import { defineConfig } from 'oxfmt'

/** @type {import('oxfmt').OxfmtConfig} */
export default defineConfig({
  printWidth: 100,
  semi: false,
  singleQuote: true,
  arrowParens: 'always',
  sortImports: true,
  sortTailwindcss: {
    stylesheet: './src/layouts/base.css',
    functions: ['clsx'],
    attributes: ['className', 'class', 'class:list'],
  },
  sortPackageJson: false,
  ignorePatterns: ['**/*.astro'],
})
