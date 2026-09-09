/** @type {import('knip').KnipConfig} */
// Astro site. Content collections are data, not import graphs.
// Unused exports and types stay off until unused-export cleanup.
// `files` and declared deps stay strict (phantom-dep catch).
export default {
  entry: ['keystatic.config.ts', 'keystatic/**/*.{ts,tsx}', 'cms/**/*.{ts,tsx,astro}'],
  ignore: ['src/data/**'],
  ignoreDependencies: [
    'babel-plugin-react-compiler', // string plugin in astro.config.mjs
    '@types/geojson', // GeoJSON namespace used without a direct import
  ],
  rules: {
    files: 'error',
    dependencies: 'error',
    devDependencies: 'error',
    unlisted: 'error',
    binaries: 'error',
    exports: 'off',
    types: 'off',
    enumMembers: 'off',
    duplicates: 'off',
  },
}
