import { collection, fields } from '@keystatic/core'
import { rsvDSubsectionsField } from '../keystatic/fields/rsvDSubsectionsField'
import { trassenscoutSlugItemLabel } from '../keystatic/utils/trassenscoutSlugItemLabel'

export const basePath = 'src/data/steckbriefe'

export const visibilityEnumAndOrder = ['visible', 'hidden'] as const
export const stateEnumAndOrder = [
  'idea',
  'agreement_process',
  'planning',
  'in_progress',
  'done',
] as const
export const stakeholderRoleEnumAndOrder = [
  'authority',
  'communication',
  'construction_company',
] as const

export const keystaticSteckbriefeConfig = collection({
  label: 'Steckbriefe',
  slugField: 'slug',
  path: `${basePath}/*/`,
  format: { contentField: 'description' },
  columns: ['visibility', 'title', 'lastCheckedDate'],
  schema: {
    visibility: fields.select({
      label: 'Sichtbarkeit',
      description:
        'Versteckt: bleibt im CMS bearbeitbar, erscheint aber nicht auf der Website (Listen, Karten, Detailseite). Speichern und auf den nächsten Deploy warten. Löschen geht über das Menü des Eintrags (nicht nur Verstecken).',
      options: [
        { label: 'Sichtbar', value: 'visible' },
        { label: 'Versteckt', value: 'hidden' },
      ],
      defaultValue: 'visible',
    }),
    slug: fields.text({
      label: 'Slug / URL-Teil',
      description: 'Bestehende ID, z.B. frm7-hessen',
      validation: { isRequired: true },
    }),
    title: fields.text({ label: 'Titel', validation: { isRequired: true } }),
    description: fields.mdx({
      label: 'Kurzfassung',
      options: { image: false, link: true },
    }),
    geometrySource: fields.conditional(
      fields.select({
        label: 'Geometrie-Quelle',
        options: [
          { label: 'Kein Trassenscout', value: 'none' },
          { label: 'Trassenscout-Projekte', value: 'projects' },
          { label: 'RSV-D (zentrale Trasse)', value: 'rsv-d' },
        ],
        defaultValue: 'none',
      }),
      {
        none: fields.empty(),
        projects: fields.array(
          fields.text({
            label: 'Trassenscout slug',
            description:
              'Slug wie in der Trassenscout-URL (Kleinbuchstaben), z. B. https://trassenscout.de/elmshorn-hamburg',
          }),
          {
            label: 'Trassenscout-Projekte',
            itemLabel: (props) => trassenscoutSlugItemLabel(props.value),
            description:
              'Trassenscout-Projekt-Slugs (URL-Pfad, Kleinbuchstaben), z. B. https://trassenscout.de/elmshorn-hamburg.',
          },
        ),
        'rsv-d': rsvDSubsectionsField({
          label: 'RSV-D Teilabschnitte',
          description:
            'Aktualisieren lädt die Liste aus TrassenScout. Speichern committet die Auswahl. Jeder Teilabschnitt darf nur einem Steckbrief zugeordnet sein.',
        }),
      },
    ),
    state: fields.select({
      label: 'Planungsstand',
      options: [
        { label: 'Idee', value: 'idea' },
        { label: 'Abstimmungsprozess', value: 'agreement_process' },
        { label: 'Planung', value: 'planning' },
        { label: 'Im Bau', value: 'in_progress' },
        { label: 'Fertig', value: 'done' },
      ],
      defaultValue: 'planning',
    }),
    ref: fields.text({ label: 'Referenz (z.B. RS8, FRM 7)' }),
    fromCity: fields.text({ label: 'Von (Stadt)' }),
    fromFederalState: fields.text({ label: 'Von (Bundesland)' }),
    toCity: fields.text({ label: 'Nach (Stadt)' }),
    toFederalState: fields.text({ label: 'Nach (Bundesland)' }),
    lengthKm: fields.number({ label: 'Länge (km)' }),
    stand: fields.date({ label: 'Stand' }),
    lastCheckedDate: fields.date({ label: 'Zuletzt geprüft' }),
    sourceUrl: fields.url({ label: 'Quellen-URL' }),
    website: fields.url({ label: 'Projektwebsite' }),
    stakeholders: fields.array(
      fields.object({
        name: fields.text({ label: 'Name', validation: { isRequired: true } }),
        roles: fields.multiselect({
          label: 'Rollen',
          options: [
            { label: 'Zuständigkeit', value: 'authority' },
            { label: 'Kommunikation', value: 'communication' },
            { label: 'Bau', value: 'construction_company' },
          ],
        }),
      }),
      { label: 'Stakeholders', itemLabel: (props) => props.fields.name.value || 'Stakeholder' },
    ),
    showOnHome: fields.checkbox({
      label: 'Auf Startseite anzeigen',
      defaultValue: false,
    }),
    order: fields.number({ label: 'Reihenfolge', defaultValue: 0 }),
  },
})
