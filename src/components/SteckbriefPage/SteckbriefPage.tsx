import Link from '@components/links/Link'
import { RSVMap } from '@components/Map/RsvMap'
import { H1, H4 } from '@components/Text'
import type { ReactNode } from 'react'
import type { SteckbriefCollectionEntry } from 'src/lib/steckbrief/getSteckbriefTeasers'
import { getSteckbriefDisplayTitle } from 'src/lib/steckbrief/getSteckbriefTeasers'
import type { SteckbriefApiFields } from 'src/types/steckbrief'

import { SteckbriefPageFeedbackCallout } from './SteckbriefPageFeedbackCallout'
import { SteckbriefPageProgressBar } from './SteckbriefPageProgressBar'

type Props = {
  steckbrief: SteckbriefCollectionEntry['data']
  description?: ReactNode
}

const ApiFieldRow = ({ label, value }: { label: string; value?: string }) => {
  if (!value) return null
  return (
    <div className="space-y-2">
      <p className="font-bold">{label}</p>
      <p>{value}</p>
    </div>
  )
}

export const SteckbriefPage = ({ steckbrief, description }: Props) => {
  const { geometry, apiFields } = steckbrief
  const displayTitle = getSteckbriefDisplayTitle(steckbrief)

  return (
    <div className="relative min-h-[860px] bg-white">
      <div className="mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:py-12">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:ml-[48vw] lg:max-w-4xl lg:px-0 lg:py-0 lg:pl-14">
          <H1 className="sm:mt-0 sm:text-4xl!">{displayTitle}</H1>
          <div className="mt-8">
            <SteckbriefPageProgressBar currentState={steckbrief.state} />
          </div>
          {description ? (
            <div className="prose mt-8 max-w-none">
              <H4 className="mb-4">Kurzfassung</H4>
              {description}
              {steckbrief.sourceUrl && (
                <p className="mt-2 text-sm">
                  (Quelle:&nbsp;
                  <a
                    href={steckbrief.sourceUrl}
                    className="text-slate-600 hover:text-slate-700 hover:underline active:underline"
                  >
                    {new URL(steckbrief.sourceUrl).host}
                  </a>
                  )
                </p>
              )}
            </div>
          ) : null}
          {steckbrief.website && (
            <div className="mt-6">
              <Link blank href={steckbrief.website}>
                Zur Projektwebsite
              </Link>
            </div>
          )}
          <div className="mt-8 flex flex-col gap-3">
            <H4 className="mb-4">Projektdetails</H4>
            {steckbrief.fromCity && steckbrief.toCity && (
              <div className="space-y-2">
                <p className="font-bold">Trassenführung</p>
                <p>{`${steckbrief.fromCity} - ${steckbrief.toCity}`}</p>
              </div>
            )}
            {steckbrief.lengthKm != null && (
              <div className="space-y-2">
                <p className="font-bold">Länge</p>
                <p>ca. {steckbrief.lengthKm.toLocaleString('de-DE')}&thinsp;km</p>
              </div>
            )}
            {Boolean(steckbrief.stakeholders?.length) && (
              <div className="flex min-w-max">
                <div className="space-y-2">
                  <p className="font-bold">Zuständigkeit</p>
                  {steckbrief.stakeholders?.map((stakeholder) => (
                    <p key={stakeholder.name}>{stakeholder.name}</p>
                  ))}
                </div>
              </div>
            )}
            {steckbrief.stand && (
              <div className="space-y-2">
                <p className="font-bold">Stand</p>
                <p>
                  {new Date(steckbrief.stand).toLocaleDateString('de-DE', {
                    year: 'numeric',
                    month: 'long',
                  })}
                </p>
              </div>
            )}
            <TrassenscoutApiFields apiFields={apiFields} />
          </div>
          <SteckbriefPageFeedbackCallout
            geometryBbox={geometry.bbox as [number, number, number, number]}
          />
          <div className="mt-12">
            <a href="/datenschutz/">Datenschutz</a>
            {' - '}
            <a href="/impressum/">Impressum</a>
          </div>
          {steckbrief.lastCheckedDate ? (
            <p className="mt-4 text-right text-sm text-slate-500">
              Zuletzt geprüft am{' '}
              {new Date(steckbrief.lastCheckedDate).toLocaleDateString('de-DE', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          ) : null}
        </div>
      </div>
      <div className="mx-auto flex aspect-square max-h-[860px] translate-x-1 overflow-hidden overscroll-none md:max-w-[860px] lg:fixed lg:bottom-0 lg:left-0 lg:z-10 lg:mx-0 lg:h-full lg:max-h-full lg:w-[48vw] lg:max-w-[48vw] lg:items-stretch">
        <RSVMap slug={steckbrief.slug} geometry={geometry} />
      </div>
    </div>
  )
}

const TrassenscoutApiFields = ({ apiFields }: { apiFields: SteckbriefApiFields }) => {
  const hasFields = apiFields.operator || apiFields.status || apiFields.estimatedCompletionDate
  if (!hasFields) return null

  return (
    <>
      <ApiFieldRow label="Betreiber" value={apiFields.operator} />
      <ApiFieldRow label="Status (Teilabschnitt)" value={apiFields.status} />
      <ApiFieldRow
        label="Voraussichtliche Fertigstellung"
        value={apiFields.estimatedCompletionDate}
      />
    </>
  )
}
