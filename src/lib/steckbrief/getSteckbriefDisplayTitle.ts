type SteckbriefTitleFields = {
  title: string
  ref?: string
}

export function getSteckbriefDisplayTitle(entry: SteckbriefTitleFields) {
  if (entry.ref && Number.isNaN(parseFloat(entry.ref))) {
    return `${entry.ref}: ${entry.title}`
  }
  return entry.title
}
