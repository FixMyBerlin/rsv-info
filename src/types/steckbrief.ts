import type { GeometrySource } from '../lib/trassenscout/geometrySource'
import type { GeometrySchema } from './geometry'

export type ProgressState = 'idea' | 'agreement_process' | 'planning' | 'in_progress' | 'done'

export type SteckbriefVisibility = 'visible' | 'hidden'

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
  visibility: SteckbriefVisibility
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
  geometrySource: GeometrySource
  showOnHome: boolean
  order: number
  geometry: GeometrySchema
  apiFields: SteckbriefApiFields
}

export type PublishedSteckbriefData = SteckbriefEntry & {
  staticMap: string
}

export type FederalStateFilterOption = {
  state: string
  count: number
  path: string
}

export type SteckbriefTeaser = {
  slug: string
  title: string
  ref?: string
  descriptionText?: string
  state: ProgressState
  staticMap: string
}
