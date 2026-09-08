import type { ReactNode } from 'react'
import type { GeometryFeature } from 'src/types/geometry'
import { presentLegendKinds } from 'src/utils/geometryKind'
import { mapColors, mapPaint } from 'src/utils/mapColors'

type Props = {
  features: GeometryFeature[]
}

function LegendItem({ label, swatch }: { label: string; swatch: ReactNode }) {
  return (
    <div className="flex flex-row items-center gap-2">
      {swatch}
      <p>{label}</p>
    </div>
  )
}

export const Legend = ({ features }: Props) => {
  const kinds = presentLegendKinds(features)
  const items = [
    kinds.vorzugstrasse && (
      <LegendItem
        key="vorzugstrasse"
        label="Vorzugstrasse"
        swatch={<span className="h-1 w-10" style={{ backgroundColor: mapColors.main }} />}
      />
    ),
    kinds.variante && (
      <LegendItem
        key="variante"
        label="Variante"
        swatch={<span className="h-1 w-10" style={{ backgroundColor: mapColors.side }} />}
      />
    ),
    kinds.korridor && (
      <LegendItem
        key="korridor"
        label="Korridor"
        swatch={
          <span
            className="h-3 w-10 rounded-full"
            style={{ backgroundColor: mapColors.main, opacity: mapPaint.corridorLineOpacity }}
          />
        }
      />
    ),
    kinds.flaeche && (
      <LegendItem
        key="flaeche"
        label="Trassenkorridor"
        swatch={
          <span
            className="h-4 w-8 rounded-sm border-2"
            style={{
              backgroundColor: mapColors.main,
              opacity: mapPaint.areaFillOpacity,
              borderColor: mapColors.main,
            }}
          />
        }
      />
    ),
  ].filter(Boolean)

  if (items.length === 0) return null

  return (
    <div className="flex min-h-14 flex-wrap items-center justify-around gap-x-4 gap-y-2 bg-[#F2F2F2] px-3 py-2 text-base text-gray-500">
      {items}
    </div>
  )
}
