import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId, useCdn } from '../env'

export const client = createClient({
  projectId: projectId || 'mock-project-id',
  dataset,
  apiVersion,
  useCdn,
  perspective: 'published',
})
