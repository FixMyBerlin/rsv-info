import { defineConfig } from 'oxlint'

/** @type {import('oxlint').OxlintConfig} */
export default defineConfig({
  plugins: ['eslint', 'typescript', 'unicorn', 'oxc', 'react'],
  jsPlugins: [
    {
      name: 'react-hooks-js',
      specifier: 'eslint-plugin-react-hooks',
    },
  ],
  rules: {
    'react/rules-of-hooks': 'error',
    'react/exhaustive-deps': 'warn',
    'react-hooks-js/rules-of-hooks': 'off',
    'react-hooks-js/exhaustive-deps': 'off',
    'react-hooks-js/config': 'error',
    'react-hooks-js/error-boundaries': 'error',
    'react-hooks-js/gating': 'error',
    'react-hooks-js/globals': 'error',
    'react-hooks-js/immutability': 'error',
    'react-hooks-js/incompatible-library': 'warn',
    'react-hooks-js/preserve-manual-memoization': 'error',
    'react-hooks-js/purity': 'error',
    'react-hooks-js/refs': 'error',
    'react-hooks-js/set-state-in-effect': 'error',
    'react-hooks-js/set-state-in-render': 'error',
    'react-hooks-js/static-components': 'error',
    'react-hooks-js/unsupported-syntax': 'warn',
    'react-hooks-js/use-memo': 'error',
    'react-hooks-js/component-hook-factories': 'error',
  },
  overrides: [
    {
      files: ['*.astro', '**/*.astro'],
      globals: {
        Fragment: 'readonly',
      },
      env: {
        node: true,
      },
    },
  ],
})
