import { collection, config, fields } from '@keystatic/core'
import { block } from '@keystatic/core/content-components'
import { contentViewImageDefaultDouble } from './keystatic/utils/contentViewImageDefaultDouble'
import { contentViewImageHorizontal } from './keystatic/utils/contentViewImageHorizontal'
import { contentViewImageSquare } from './keystatic/utils/contentViewImageSquare'
import { contentViewImageVertical } from './keystatic/utils/contentViewImageVertical'

export default config({
  storage: {
    // kind: 'local',
    kind: 'github',
    repo: {
      owner: 'FixMyBerlin',
      name: 'rsv-info',
    },
  },
  ui: {
    brand: {
      name: 'RSV-Info',
      // mark: () => <img src="/favicon-32x32.png" height={27} />,
    },
    navigation: {
      Blog: ['posts'],
    },
  },
  collections: {
    posts: collection({
      label: 'Blogbeiträge',
      slugField: 'title',
      path: 'src/content/posts/*',
      columns: ['order', 'title'],
      format: { contentField: 'content' },
      schema: {
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
        category: fields.select({
          label: 'Bereich auf der Webseite auf dem der Blogeintrag erscheinen soll',
          options: [
            { label: 'Kommunikation', value: 'communication' },
            { label: 'Planung', value: 'planning' },
          ],
          defaultValue: 'communication',
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
        teaserImage: fields.image({
          label: 'Bild',
          description:
            'Bild bitte im Format 2:3 (quer) hochlade bzw. wird dementsprechend beschnitten.',
          directory: 'src/assets/posts',
          publicPath: '/src/assets/posts',
          validation: { isRequired: true },
        }),
        imageCopyright: fields.text({
          label: 'Copyright Bild',
          validation: { length: { min: 1, max: 100 } },
        }),
        content: fields.mdx({
          label: 'Content',
          components: {
            ImageSingleVertical: block({
              label: 'Bild: einzeln, Hochformat',
              schema: {
                src: fields.image({
                  label: 'Bild',
                  directory: 'src/assets/posts',
                  publicPath: '/src/assets/posts',
                  validation: { isRequired: true },
                }),
                caption: fields.text({
                  label: 'Bildunterschrift',
                  validation: { length: { min: 1, max: 80 } },
                }),
                alt: fields.text({ label: 'Alt-Text' }),
                imageConfig: fields.conditional(
                  fields.select({
                    label: 'Breite',
                    description:
                      'Wieviel Platz soll das Bild im Verhältnis zur Breite des ganzen Textblocks einnehmen? Auf mobilen Screens wird immer die ganze Breite genommen.',
                    options: [
                      { label: 'halbe Breite', value: 'half' },
                      { label: 'ganze Breite', value: 'full' },
                    ],
                    defaultValue: 'half',
                  }),
                  {
                    half: fields.select({
                      label: 'Position',
                      options: [
                        { label: 'links', value: 'left' },
                        { label: 'zentriert', value: 'center' },
                        { label: 'rechts', value: 'right' },
                      ],
                      defaultValue: 'left',
                    }),
                    full: fields.empty(),
                  },
                ),
              },
              ContentView: contentViewImageVertical,
            }),
            ImageSingleHorizontal: block({
              label: 'Bild: einzeln, Querformat',
              schema: {
                src: fields.image({
                  label: 'Bild',
                  directory: 'src/assets/posts',
                  publicPath: '/src/assets/posts',
                  validation: { isRequired: true },
                }),
                caption: fields.text({
                  label: 'Bildunterschrift',
                  validation: { length: { min: 1, max: 80 } },
                }),
                alt: fields.text({ label: 'Alt-Text' }),
                imageConfig: fields.conditional(
                  fields.select({
                    label: 'Seitenverhältnis',
                    description:
                      'Breite Formate (16:9 und 9:4) werden immer über die ganze Breite dargestellt.',
                    options: [
                      { label: '3:2', value: '3/2' },
                      { label: '4:3', value: '4/3' },
                      { label: '9:4', value: '9/4' },
                      { label: '16:9', value: 'pano' },
                    ],
                    defaultValue: '4/3',
                  }),
                  {
                    '3/2': fields.conditional(
                      fields.select({
                        label: 'Breite',
                        description:
                          'Wieviel Platz soll das Bild im Verhältnis zur Breite des ganzen Textblocks einnehmen? Auf mobilen Screens wird immer die ganze Breite genommen.',
                        options: [
                          { label: 'halbe Breite', value: 'half' },
                          { label: 'ganze Breite', value: 'full' },
                        ],
                        defaultValue: 'full',
                      }),
                      {
                        half: fields.select({
                          label: 'Position',
                          options: [
                            { label: 'links', value: 'left' },
                            { label: 'zentriert', value: 'center' },
                            { label: 'rechts', value: 'right' },
                          ],
                          defaultValue: 'left',
                        }),
                        full: fields.empty(),
                      },
                    ),
                    '4/3': fields.conditional(
                      fields.select({
                        label: 'Breite',
                        description:
                          'Wieviel Platz soll das Bild im Verhältnis zur Breite des ganzen Textblocks einnehmen? Auf mobilen Screens wird immer die ganze Breite genommen.',
                        options: [
                          { label: 'halbe Breite', value: 'half' },
                          { label: 'ganze Breite', value: 'full' },
                        ],
                        defaultValue: 'full',
                      }),
                      {
                        half: fields.select({
                          label: 'Position',
                          options: [
                            { label: 'links', value: 'left' },
                            { label: 'zentriert', value: 'center' },
                            { label: 'rechts', value: 'right' },
                          ],
                          defaultValue: 'left',
                        }),
                        full: fields.empty(),
                      },
                    ),
                    '9/4': fields.empty(),
                    pano: fields.empty(),
                  },
                ),
              },
              ContentView: contentViewImageHorizontal,
            }),
            ImageSingleSquare: block({
              label: 'Bild: einzeln, quadratisch',
              schema: {
                src: fields.image({
                  label: 'Bild',
                  directory: 'src/assets/posts',
                  publicPath: '/src/assets/posts',
                  validation: { isRequired: true },
                }),
                caption: fields.text({
                  label: 'Bildunterschrift',
                  validation: { length: { min: 1, max: 80 } },
                }),
                alt: fields.text({ label: 'Alt-Text' }),
                imageConfig: fields.conditional(
                  fields.select({
                    label: 'Breite',
                    description:
                      'Wieviel Platz soll das Bild im Verhältnis zur Breite des ganzen Textblocks einnehmen? Auf mobilen Screens wird immer die ganze Breite genommen.',
                    options: [
                      { label: 'halbe Breite', value: 'half' },
                      { label: 'ganze Breite', value: 'full' },
                    ],
                    defaultValue: 'full',
                  }),
                  {
                    half: fields.select({
                      label: 'Position',
                      options: [
                        { label: 'links', value: 'left' },
                        { label: 'zentriert', value: 'center' },
                        { label: 'rechts', value: 'right' },
                      ],
                      defaultValue: 'left',
                    }),
                    full: fields.empty(),
                  },
                ),
              },
              ContentView: contentViewImageSquare,
            }),
            ImageDouble: block({
              label: 'Bild: doppelt',
              description: 'quer / hoch / quadratisch',
              schema: {
                src: fields.image({
                  label: '1. Bild',
                  directory: 'src/assets/posts',
                  publicPath: '/src/assets/posts',
                  validation: { isRequired: true },
                }),
                caption: fields.text({
                  label: 'Bildunterschrift',
                  validation: { length: { min: 1, max: 80 } },
                }),
                srcSecond: fields.image({
                  label: '2. Bild',
                  directory: 'src/assets/posts',
                  publicPath: '/src/assets/posts',
                  validation: { isRequired: true },
                }),
                captionSecond: fields.text({
                  label: 'Bildunterschrift',
                  validation: { length: { min: 1, max: 80 } },
                }),
                alt: fields.text({ label: 'Alt-Text' }),
                imageConfig: fields.conditional(
                  fields.select({
                    label: 'Ausrichtung',
                    description: '',
                    options: [
                      { label: 'quer', value: 'horizontal' },
                      { label: 'hoch', value: 'vertical' },
                      { label: 'quadratisch', value: 'square' },
                    ],
                    defaultValue: 'vertical',
                  }),
                  {
                    vertical: fields.select({
                      label: 'Seitenverhältnis',
                      options: [
                        { label: '3:2', value: '3/2' },
                        { label: '4:3', value: '4/3' },
                      ],
                      defaultValue: '3/2',
                    }),
                    horizontal: fields.select({
                      label: 'Seitenverhältnis',
                      options: [
                        { label: '3:2', value: '3/2' },
                        { label: '4:3', value: '4/3' },
                      ],
                      defaultValue: '3/2',
                    }),
                    square: fields.empty(),
                  },
                ),
              },
              ContentView: contentViewImageDefaultDouble,
            }),
          },
        }),
      },
    }),
  },
})
