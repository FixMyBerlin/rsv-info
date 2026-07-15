const TRASSENSCOUT_API_BASE_URL = 'https://trassenscout.de'

export function trassenscoutProjectApiUrl(slug: string): string {
  return `${TRASSENSCOUT_API_BASE_URL}/api/projects/${encodeURIComponent(slug)}.json`
}
