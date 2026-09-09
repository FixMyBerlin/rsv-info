import { glob } from 'astro/loaders'

export const loader = (
  contentBase: string,
  format: 'mdx' | 'json' | 'yaml',
  pattern = `**/[^_]*.${format}`,
) => {
  const base = contentBase.startsWith('/') ? `.${contentBase}` : contentBase
  return glob({ base, pattern })
}
