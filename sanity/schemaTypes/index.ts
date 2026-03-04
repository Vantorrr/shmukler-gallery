import { type SchemaTypeDefinition } from 'sanity'

import artist       from './artist'
import artwork      from './artwork'
import exhibition   from './exhibition'
import event        from './event'
import announcement from './announcement'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [artwork, artist, exhibition, event, announcement],
}
