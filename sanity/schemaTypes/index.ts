import { type SchemaTypeDefinition } from 'sanity'

import artist from './artist'
import artwork from './artwork'
import exhibition from './exhibition'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [artist, artwork, exhibition],
}
