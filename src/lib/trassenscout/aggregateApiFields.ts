import type { SteckbriefApiFields } from '../../types/steckbrief'

type FeatureWithApiProps = {
  properties: {
    operator?: string | null
    status?: string | null
    estimatedCompletionDateString?: string | null
  }
}

function aggregateField(
  features: FeatureWithApiProps[],
  key: 'operator' | 'status' | 'estimatedCompletionDateString',
): string | undefined {
  const values = new Set<string>()

  for (const feature of features) {
    const raw = feature.properties[key]
    if (raw === null || raw === undefined) continue
    const trimmed = String(raw).trim()
    if (trimmed) values.add(trimmed)
  }

  if (values.size === 0) return undefined
  return [...values].sort((a, b) => a.localeCompare(b, 'de')).join(', ')
}

export function aggregateApiFields(features: FeatureWithApiProps[]): SteckbriefApiFields {
  const operator = aggregateField(features, 'operator')
  const status = aggregateField(features, 'status')
  const estimatedCompletionDate = aggregateField(features, 'estimatedCompletionDateString')

  return {
    ...(operator ? { operator } : {}),
    ...(status ? { status } : {}),
    ...(estimatedCompletionDate ? { estimatedCompletionDate } : {}),
  }
}
