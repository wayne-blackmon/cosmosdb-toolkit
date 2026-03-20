// src/providers/metadata/metadataSchema.ts

export interface ApiParameter {
  name: string
  type: string
  optional?: boolean
  documentation?: string
}

export interface ApiSignature {
  label: string
  parameters: ApiParameter[]
  returns: string
  documentation?: string
}

export interface ApiFunction {
  label: string
  detail: string
  documentation: string
  signatures: ApiSignature[]

  // Hover‑specific enrichments
  examples?: string[]
  related?: string[]
  notes?: string[]
}

export interface ApiGroup {
  label: string
  functions: ApiFunction[]
}

export interface CosmosApiMetadata {
  context: ApiGroup
  collection: ApiGroup
  request: ApiGroup
  response: ApiGroup
}
