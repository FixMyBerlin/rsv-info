import { fields } from '@keystatic/core'
import type { MdxAssetContext } from './components/mdxComponentsKeystatic'

export const blogTypeEnumAndOrder = ['Artikel', 'Studie'] as const

export const blogSchemaFields = {
  title: fields.slug({
    name: {
      label: 'Titel',
      validation: { length: { min: 1, max: 80 } },
    },
    slug: {
      description:
        'Bitte keine Änderungen nach initialem Speichern. Keine Großbuchstaben, Umlaute, Sonderzeichen oder Leerzeichen.',
      label: 'Dateiname / URL-Teil',
      validation: { length: { min: 1, max: 80 } },
    },
  }),
  subTitle: fields.text({
    label: 'Untertitel',
    validation: { length: { min: 1, max: 300 } },
  }),
  preview: fields.checkbox({
    label: 'Vorschau (diese Seite wird nicht veröffentlicht, sondern im Vorschaumodus gebaut)',
    description:
      "Die Vorschau ist unter der erwarteten URL + '--preview' erreichbar. Z.B. /kommunikation/beteiligung-inklusiv-gestalten--preview",
    defaultValue: true,
  }),
  type: fields.select({
    label: 'Typ',
    options: [
      { label: 'Artikel', value: 'Artikel' },
      { label: 'Studie', value: 'Studie' },
    ],
    defaultValue: 'Artikel',
  }),
  teaserText: fields.text({
    label: 'Kurzbeschreibung auf Teaser',
    validation: { length: { min: 1, max: 300 } },
  }),
  showOnHome: fields.checkbox({
    label: 'auf Startseite anzeigen',
    defaultValue: false,
  }),
  order: fields.number({
    label: 'Reihenfolge in der Aufzählung',
    validation: { isRequired: true, min: 0 },
  }),
  date: fields.date({
    label: 'Datum des Blogeintrags',
    validation: { isRequired: true },
  }),
  imageCopyright: fields.text({
    label: 'Copyright Bild',
    validation: { length: { min: 1, max: 100 } },
  }),
  uploads: fields.array(
    fields.object({
      name: fields.slug({
        name: { label: 'Beschriftung', validation: { isRequired: true } },
        slug: { label: 'Dateiname' },
      }),
      file: fields.file({
        label: 'Datei',
        validation: { isRequired: true },
      }),
    }),
    {
      itemLabel: (props) => props.fields.name.value.name || 'Datei',
      slugField: 'name',
      label: 'Dateien',
    },
  ),
}

export function teaserImageField(assetDir: MdxAssetContext) {
  return fields.image({
    label: 'Bild',
    description: 'Bild bitte im Format 2:3 (quer) hochlade bzw. wird dementsprechend beschnitten.',
    directory: `src/assets/${assetDir}`,
    publicPath: `/src/assets/${assetDir}`,
    validation: { isRequired: true },
  })
}
