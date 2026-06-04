import type { GeometrySchema } from './geometry'

export type ProgressState = 'idea' | 'agreement_process' | 'planning' | 'in_progress' | 'done'

export type SteckbriefApiFields = {
  operator?: string
  status?: string
  estimatedCompletionDate?: string
}

export type SteckbriefStakeholder = {
  name: string
  roles: ('authority' | 'communication' | 'construction_company')[]
}

export type SteckbriefEntry = {
  slug: string
  title: string
  ref?: string
  state: ProgressState
  fromCity?: string
  fromFederalState?: string
  toCity?: string
  toFederalState?: string
  lengthKm?: number
  stand?: string
  lastCheckedDate?: string
  sourceUrl?: string
  website?: string
  stakeholders?: SteckbriefStakeholder[]
  trassenscoutProjectSlugs: string[]
  showOnHome: boolean
  order: number
  description?: unknown
  geometry: GeometrySchema
  apiFields: SteckbriefApiFields
}

export type SteckbriefTeaser = {
  slug: string
  title: string
  ref?: string
  descriptionText?: string
  state: ProgressState
  staticMap: string
}
