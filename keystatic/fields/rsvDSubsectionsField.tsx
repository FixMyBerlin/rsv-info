import type { BasicFormField, FormFieldStoredValue } from '@keystatic/core'
import { useEffect, useState } from 'react'

import { fetchTrassenscoutProject } from '../../src/lib/trassenscout/fetchProject'
import { RSV_D_PROJECT_SLUG } from '../../src/lib/trassenscout/geometrySource'
import { rsvDSubsectionSlugsFromCollection } from '../../src/lib/trassenscout/rsvDSubsections'

function parseAsStringArray(value: FormFieldStoredValue): string[] {
  if (value === undefined || value === null) return []
  if (!Array.isArray(value)) {
    throw new Error('Must be an array of strings')
  }
  return value.filter((item): item is string => typeof item === 'string' && item.length > 0)
}

type SubsectionOption = {
  slug: string
  label: string
}

export function rsvDSubsectionsField({
  label,
  description,
}: {
  label: string
  description?: string
}): BasicFormField<string[]> {
  return {
    kind: 'form',
    formKind: undefined,
    label,
    Input(props) {
      const selected = props.value
      const [options, setOptions] = useState<SubsectionOption[]>([])
      const [syncedAt, setSyncedAt] = useState<string | null>(null)
      const [loading, setLoading] = useState(false)
      const [error, setError] = useState<string | null>(null)
      const [loadedOnce, setLoadedOnce] = useState(false)

      const loadOptions = async () => {
        setLoading(true)
        setError(null)
        try {
          const collection = await fetchTrassenscoutProject(RSV_D_PROJECT_SLUG, {
            bypassCache: true,
          })
          setOptions(
            rsvDSubsectionSlugsFromCollection(collection).map((slug) => ({ slug, label: slug })),
          )
          setSyncedAt(new Date().toISOString())
          setLoadedOnce(true)
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err)
          setError(`Teilabschnitte konnten nicht geladen werden: ${message}`)
        } finally {
          setLoading(false)
        }
      }

      useEffect(() => {
        void loadOptions()
      }, [])

      const optionSlugs = new Set(options.map((option) => option.slug))
      const missingSelected = selected.filter((slug) => !optionSlugs.has(slug))

      const toggle = (slug: string) => {
        if (selected.includes(slug)) {
          props.onChange(selected.filter((item) => item !== slug))
        } else {
          props.onChange([...selected, slug].sort((a, b) => a.localeCompare(b, 'de')))
        }
      }

      return (
        <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 14 }}>
          <div style={{ marginBottom: 8, fontWeight: 600 }}>{label}</div>
          {description ? (
            <p style={{ margin: '0 0 12px', color: '#555', lineHeight: 1.4 }}>{description}</p>
          ) : null}

          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
            <button type="button" onClick={() => void loadOptions()} disabled={loading}>
              {loading ? 'Lade…' : 'Teilabschnitte aktualisieren'}
            </button>
            {syncedAt ? (
              <span style={{ color: '#666', fontSize: 12 }}>
                Stand API: {new Date(syncedAt).toLocaleString('de-DE')}
              </span>
            ) : null}
          </div>

          {error ? <p style={{ color: '#b00020', margin: '0 0 12px' }}>{error}</p> : null}

          {loadedOnce && selected.length === 0 ? (
            <p style={{ color: '#9a6700', margin: '0 0 12px' }}>
              Mindestens einen Teilabschnitt wählen.
            </p>
          ) : null}

          {missingSelected.length > 0 ? (
            <p style={{ color: '#9a6700', margin: '0 0 12px' }}>
              Ausgewählt, aber nicht in der aktuellen API-Liste:{' '}
              {missingSelected.map((slug) => (
                <label key={slug} style={{ display: 'inline-flex', gap: 4, marginRight: 8 }}>
                  <input type="checkbox" checked onChange={() => toggle(slug)} />
                  <code>{slug}</code>
                </label>
              ))}
            </p>
          ) : null}

          {loadedOnce && options.length === 0 && !loading && !error ? (
            <p style={{ color: '#666' }}>Keine Teilabschnitte in RSV-D gefunden.</p>
          ) : null}

          <div
            style={{
              maxHeight: 360,
              overflow: 'auto',
              border: '1px solid #ddd',
              borderRadius: 6,
              padding: 8,
            }}
          >
            {options.map((option) => (
              <label
                key={option.slug}
                style={{
                  display: 'flex',
                  gap: 8,
                  alignItems: 'center',
                  padding: '4px 2px',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  checked={selected.includes(option.slug)}
                  onChange={() => toggle(option.slug)}
                />
                <code>{option.label}</code>
              </label>
            ))}
          </div>

          <p style={{ margin: '8px 0 0', color: '#666', fontSize: 12 }}>
            Ausgewählt: {selected.length}
          </p>
        </div>
      )
    },
    defaultValue() {
      return []
    },
    parse(value) {
      return parseAsStringArray(value)
    },
    serialize(value) {
      return { value: value.length > 0 ? value : [] }
    },
    validate(value) {
      return value
    },
    reader: {
      parse(value) {
        return parseAsStringArray(value)
      },
    },
  }
}
