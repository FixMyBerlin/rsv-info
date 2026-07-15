const TRASSENSCOUT_API_BASE_URL = 'https://trassenscout.de'

export function trassenscoutProjectApiUrl(slug: string): string {
  return `${TRASSENSCOUT_API_BASE_URL}/api/projects/${encodeURIComponent(slug)}.json`
}

function escapeHtml(value: string): string {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
}

export function trassenscoutSlugItemLabel(slug: string | undefined): string {
  if (!slug) return 'Slug'

  const apiUrl = trassenscoutProjectApiUrl(slug)
  return `${escapeHtml(slug)} · <a href="${apiUrl}" target="_blank" rel="noopener noreferrer">API Preview</a>`
}
