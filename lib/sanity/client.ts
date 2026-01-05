import { createClient } from '@sanity/client'
import { config } from './config'

export const client = createClient({
  projectId: config.projectId,
  dataset: config.dataset,
  apiVersion: config.apiVersion,
  useCdn: config.useCdn,
  // No token needed for public reads
})

