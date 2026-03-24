// src/providers/metadata/metadataSchema.ts

export interface CosmosFunctionSnippetVariant {
  prefix: string
  description?: string
  body: string[]
}

export interface CosmosFunctionSnippet {
  js: CosmosFunctionSnippetVariant
  ts: CosmosFunctionSnippetVariant
}

export interface ApiParameter {
  name: string
  type: string
  optional?: boolean
  documentation?: string
}

export interface ApiSignature {
  label: string
  parameters: ApiParameter[]
  returns?: string
  documentation?: string
}

export interface ApiFunction {
  label: string
  detail?: string
  documentation?: string
  signatures: ApiSignature[]
  notes?: string[]
  tips?: string[]
  warnings?: string[]
  performance?: string[]
  antiPatterns?: string[]
  examples?: string[]
  related?: string[]
  links?: { title: string; url: string }[]
  snippet?: CosmosFunctionSnippet
}

export interface ApiGroup {
  label: string
  functions: ApiFunction[]
}

export interface CosmosApi {
  context: ApiGroup
  collection: ApiGroup
  request: ApiGroup
  response: ApiGroup
}
