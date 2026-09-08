import { config } from '@keystatic/core'
import { KEYSTATIC_STORAGE_KIND } from 'astro:env/client'
import { keystaticCommunicationpostsConfig } from './cms/communicationposts.keystatic'
import { keystaticPlanningpostsConfig } from './cms/planningposts.keystatic'
import { keystaticSteckbriefeConfig } from './cms/steckbriefe.keystatic'

export default config({
  storage: {
    kind: KEYSTATIC_STORAGE_KIND,
    repo: {
      owner: 'FixMyBerlin',
      name: 'rsv-info',
    },
  },
  ui: {
    brand: {
      name: 'RSV-Info',
    },
    navigation: {
      Steckbriefe: ['steckbriefe'],
      Blog: ['planningposts', 'communicationposts'],
    },
  },
  collections: {
    steckbriefe: keystaticSteckbriefeConfig,
    planningposts: keystaticPlanningpostsConfig,
    communicationposts: keystaticCommunicationpostsConfig,
  },
})
