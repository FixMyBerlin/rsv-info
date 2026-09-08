import { fields } from '@keystatic/core'
import { block } from '@keystatic/core/content-components'
import { contentViewImageDefaultDouble } from '../../keystatic/utils/contentViewImageDefaultDouble'
import { contentViewImageHorizontal } from '../../keystatic/utils/contentViewImageHorizontal'
import { contentViewImageSquare } from '../../keystatic/utils/contentViewImageSquare'
import { contentViewImageVertical } from '../../keystatic/utils/contentViewImageVertical'

export type MdxAssetContext = 'planningposts' | 'communicationposts'

const widthDescription =
  'Wieviel Platz soll das Bild im Verhältnis zur Breite des ganzen Textblocks einnehmen? Auf mobilen Screens wird immer die ganze Breite genommen.'

function imageField(context: MdxAssetContext, label = 'Bild') {
  return fields.image({
    label,
    directory: `src/assets/${context}`,
    publicPath: `/src/assets/${context}`,
    validation: { isRequired: true },
  })
}

function captionField() {
  return fields.text({
    label: 'Bildunterschrift',
    validation: { length: { min: 1, max: 80 } },
  })
}

function positionSelect() {
  return fields.select({
    label: 'Position',
    options: [
      { label: 'links', value: 'left' },
      { label: 'zentriert', value: 'center' },
      { label: 'rechts', value: 'right' },
    ],
    defaultValue: 'left',
  })
}

function halfFullWidth(defaultValue: 'half' | 'full') {
  return fields.select({
    label: 'Breite',
    description: widthDescription,
    options: [
      { label: 'halbe Breite', value: 'half' },
      { label: 'ganze Breite', value: 'full' },
    ],
    defaultValue,
  })
}

function halfFullConditional(defaultValue: 'half' | 'full') {
  return fields.conditional(halfFullWidth(defaultValue), {
    half: positionSelect(),
    full: fields.empty(),
  })
}

function aspectSelect() {
  return fields.select({
    label: 'Seitenverhältnis',
    options: [
      { label: '3:2', value: '3/2' },
      { label: '4:3', value: '4/3' },
    ],
    defaultValue: '3/2',
  })
}

export function mdxComponentsKeystatic(context: MdxAssetContext) {
  return {
    ImageSingleVertical: block({
      label: 'Bild: einzeln, Hochformat',
      schema: {
        src: imageField(context),
        caption: captionField(),
        alt: fields.text({ label: 'Alt-Text' }),
        imageConfig: halfFullConditional('half'),
      },
      ContentView: contentViewImageVertical,
    }),
    ImageSingleHorizontal: block({
      label: 'Bild: einzeln, Querformat',
      schema: {
        src: imageField(context),
        caption: captionField(),
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
            '3/2': halfFullConditional('full'),
            '4/3': halfFullConditional('full'),
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
        src: imageField(context),
        caption: captionField(),
        alt: fields.text({ label: 'Alt-Text' }),
        imageConfig: halfFullConditional('full'),
      },
      ContentView: contentViewImageSquare,
    }),
    ImageDouble: block({
      label: 'Bild: doppelt',
      description: 'quer / hoch / quadratisch',
      schema: {
        src: imageField(context, '1. Bild'),
        caption: captionField(),
        srcSecond: imageField(context, '2. Bild'),
        captionSecond: captionField(),
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
            vertical: aspectSelect(),
            horizontal: aspectSelect(),
            square: fields.empty(),
          },
        ),
      },
      ContentView: contentViewImageDefaultDouble,
    }),
  }
}
