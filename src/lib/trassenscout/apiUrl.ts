const DEFAULT_TRASSENSCOUT_API_BASE_URL = 'https://trassenscout.de'

/** Production by default; override with TRASSENSCOUT_API_BASE_URL. */
export function trassenscoutApiBaseUrl() {
  const fromEnv =
    typeof process !== 'undefined' ? process.env.TRASSENSCOUT_API_BASE_URL?.trim() : undefined
  return fromEnv && fromEnv.length > 0
    ? fromEnv.replace(/\/$/, '')
    : DEFAULT_TRASSENSCOUT_API_BASE_URL
}

export function trassenscoutProjectApiUrl(
  slug: string,
  baseUrl: string = trassenscoutApiBaseUrl(),
) {
  return `${baseUrl}/api/projects/${encodeURIComponent(slug)}.json`
}
