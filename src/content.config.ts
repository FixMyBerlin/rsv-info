import { astroCommunicationpostsDefinition } from '../cms/communicationposts.astro'
import { astroPlanningpostsDefinition } from '../cms/planningposts.astro'
import { astroSteckbriefeDefinition } from '../cms/steckbriefe.astro'
import { astroTrassenscoutDefinition } from '../cms/trassenscout.astro'

export const collections = {
  planningposts: astroPlanningpostsDefinition,
  communicationposts: astroCommunicationpostsDefinition,
  steckbriefe: astroSteckbriefeDefinition,
  trassenscout: astroTrassenscoutDefinition,
}
