import Link from '@components/links/Link'

type Props = {
  displayTitle: string
}

const FEEDBACK_EMAIL = 'feedback@fixmycity.de'

export const SteckbriefPageFeedbackCallout = ({ displayTitle }: Props) => {
  const mailtoHref = `mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent(
    `Änderungen Radschnellverbindung ${displayTitle}`,
  )}`

  return (
    <aside className="mt-10 rounded-xl border border-emerald-500/70 bg-emerald-50 px-6 py-6 sm:px-8 sm:py-7">
      <p className="text-lg font-bold text-slate-900">
        Sind die Daten veraltet oder der Streckenverlauf nicht korrekt?
      </p>
      <p className="mt-3 text-base text-slate-800">
        Wenn Sie in der zuständigen Verwaltung arbeiten oder an der Planung dieser
        Radschnellverbindung beteiligt sind, können Sie uns aktuelle Informationen einfach per
        E-Mail an{' '}
        <Link href={mailtoHref} className="font-medium">
          {FEEDBACK_EMAIL}
        </Link>{' '}
        mitteilen. Wir aktualisieren die Geometrien und den Planungsstand kostenlos für Sie direkt
        im System. Die Änderungen sind spätestens nach zwei Wochen für alle sichtbar.
      </p>
      <div className="mt-5">
        <Link button="dark" href={mailtoHref}>
          Änderungen melden
        </Link>
      </div>
    </aside>
  )
}
