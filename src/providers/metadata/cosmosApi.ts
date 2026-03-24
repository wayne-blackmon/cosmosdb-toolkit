// src/providers/metadata/cosmosApi.ts

import { CosmosApi, CosmosFunctionSnippet } from './metadataSchema'
import { cosmosApiCore } from './cosmosApi.core'
import { cosmosSnippets } from './cosmosApi.snippets'

export const cosmosApi: CosmosApi = mergeMetadataWithSnippets(
  cosmosApiCore,
  cosmosSnippets
)

function mergeMetadataWithSnippets(
  core: CosmosApi,
  snippets: Record<string, Record<string, CosmosFunctionSnippet>>
): CosmosApi {
  // Deep clone to avoid mutating the core metadata
  const result: CosmosApi = structuredClone(core)

  for (const groupName of Object.keys(result) as (keyof CosmosApi)[]) {
    const group = result[groupName]

    for (const fn of group.functions) {
      const snippet = snippets[groupName]?.[fn.label]
      if (snippet) {
        fn.snippet = snippet
      }
    }
  }

  return result
}
