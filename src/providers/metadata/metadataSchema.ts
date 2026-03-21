// ---------------------------------------------------------------------------
// Parameter metadata
// ---------------------------------------------------------------------------
export interface ApiParameter {
  name: string
  type: string
  optional?: boolean
  documentation?: string
}

// ---------------------------------------------------------------------------
// Signature metadata
// ---------------------------------------------------------------------------
export interface ApiSignature {
  label: string
  parameters: ApiParameter[]
  returns: string
  documentation?: string
}

// ---------------------------------------------------------------------------
// Snippet metadata (NEW)
// ---------------------------------------------------------------------------
export interface CosmosFunctionSnippet {
  prefix: string
  body: string[]
  description?: string
}

// ---------------------------------------------------------------------------
// Function metadata
// ---------------------------------------------------------------------------
export interface ApiFunction {
  label: string
  detail: string
  documentation?: string
  signatures: ApiSignature[]
  examples?: string[]
  related?: string[]
  notes?: string[]

  // NEW
  snippet?: CosmosFunctionSnippet
}

// ---------------------------------------------------------------------------
// Group metadata
// ---------------------------------------------------------------------------
export interface ApiGroup {
  label: string
  functions: ApiFunction[]
}

// ---------------------------------------------------------------------------
// Root metadata object
// ---------------------------------------------------------------------------
export interface CosmosApi {
  context: ApiGroup
  collection: ApiGroup
  request: ApiGroup
  response: ApiGroup
}
