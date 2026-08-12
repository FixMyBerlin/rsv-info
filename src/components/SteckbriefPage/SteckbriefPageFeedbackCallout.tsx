import Link from '@components/links/Link'
import { mapParamFromBbox } from 'src/lib/routing/mapParamFromBbox'
import { useMapParam } from 'src/lib/routing/useMapParam'
import { buildRsvDFeedbackUrl } from 'src/lib/trassenscout/feedbackUrl'

type BBox2d = [number, number, number, number]

type Props = {
  geometryBbox: BBox2d
}

export const SteckbriefPageFeedbackCallout = ({ geometryBbox }: Props) => {
  const { mapParam } = useMapParam()
  const feedbackUrl = buildRsvDFeedbackUrl(mapParam ?? mapParamFromBbox(geometryBbox))

  return (
    <aside className="mt-10 rounded-xl border border-emerald-500/70 bg-emerald-50 px-6 py-6 sm:px-8 sm:py-7">
      <p className="text-lg font-bold text-slate-900">
        Sind die Daten veraltet oder der Streckenverlauf nicht korrekt?
      </p>
      <p className="mt-3 text-base text-slate-800">
        Wenn Sie in der Verwaltung oder Planung dieser Radschnellverbindung tätig sind, können Sie
        uns über unser <strong>Trassenscout-Formular</strong> die aktuellen Informationen schnell
        und einfach melden. Wir aktualisieren kostenlos für Sie die Veränderungen zu Geometrien und
        Planungsstand direkt im System. Die Änderungen sind spätestens nach zwei Wochen für alle
        sichtbar.
      </p>
      <div className="mt-5">
        <Link blank button="dark" href={feedbackUrl}>
          Änderungen melden
        </Link>
      </div>
    </aside>
  )
}
