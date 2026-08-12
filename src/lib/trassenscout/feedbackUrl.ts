import type { MapParam } from '../routing/mapParam'
import { serializeMapParam } from '../routing/mapParam'

export const RSV_D_FEEDBACK_BASE_URL =
  'https://trassenscout.de/beteiligung/radschnellverbindungen-info-feedback'

export const buildRsvDFeedbackUrl = (mapParam: MapParam) => {
  const mapStart = serializeMapParam(mapParam)
  return `${RSV_D_FEEDBACK_BASE_URL}?mapStart=${mapStart}`
}
