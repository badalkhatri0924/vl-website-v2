import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './sanity/schemas'

export default defineConfig({
  name: 'default',
  title: 'VersionLabs Website',
  
  projectId: 'jh5avta0',
  dataset: 'production',
  
  basePath: '/studio',
  
  plugins: [structureTool()],
  
  schema: {
    types: schemaTypes,
  },
})

