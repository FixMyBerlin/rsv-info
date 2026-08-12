import { createParser, useQueryState } from 'nuqs'

import { type MapParam, parseMapParam, serializeMapParam } from './mapParam'

const mapParamParser = createParser({
  parse: (query) => parseMapParam(query),
  serialize: (object: MapParam) => serializeMapParam(object),
})

export const useMapParam = () => {
  const [mapParam, setMapParam] = useQueryState('map', mapParamParser)
  return { mapParam, setMapParam }
}
