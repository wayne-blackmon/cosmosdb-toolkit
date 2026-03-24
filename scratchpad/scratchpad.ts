// scratchpad/scratchpad.ts
// Typed Cosmos DB server-side scratchpad
// Works with TS snippet variants (no implicit-any errors)

// ------------------------------------------------------------
// Server-side API type shims (from cosmos-server.d.ts)
// ------------------------------------------------------------
declare function getContext(): IContext

interface IContext {
  getCollection(): ICollection
  getRequest(): IRequest
  getResponse(): IResponse
}

interface ICollection {
  getSelfLink(): string

  queryDocuments(
    link: string,
    query: string | { query: string; parameters?: { name: string; value: any }[] },
    options: any,
    callback: (err: any, docs: any[], info: any) => void,
  ): boolean

  createDocument(link: string, doc: any, callback: (err: any, created?: any) => void): boolean

  readDocument(link: string, callback: (err: any, doc?: any) => void): boolean
}

interface IRequest {
  getBody(): any
  setBody(body: any): void
  getValue(): any
  setValue(value: any): void
}

interface IResponse {
  getBody(): any
  setBody(body: any): void
  setStatusCode(code: number): void
  getStatusCode(): number
}

// ------------------------------------------------------------
// Setup: common variables used across test cases
// ------------------------------------------------------------
const now = new Date()
const sampleId = 'myDocId'
const samplePartition = 'myPartition'
const sampleDoc = { id: sampleId, pk: samplePartition, value: 42 }
const sampleQuery = 'SELECT * FROM c WHERE c.pk = @pk'
const sampleParams = [{ name: '@pk', value: samplePartition }]

// ------------------------------------------------------------
// Stored Procedure Template
// ------------------------------------------------------------
export function sprocName(input: any): void {
  const context = getContext()
  const collection = context.getCollection()
  const response = context.getResponse()

  // TODO: implement logic
  response.setBody({ ok: true, input })
}

// ------------------------------------------------------------
// Example: Simple Sproc
// ------------------------------------------------------------
export function exampleSproc(input: any): void {
  const context = getContext()
  const collection = context.getCollection()
  const response = context.getResponse()

  response.setBody({ ok: true, input })
}

// ------------------------------------------------------------
// Example: Trigger
// ------------------------------------------------------------
export function exampleTrigger(doc: any): void {
  const context = getContext()
  const request = context.getRequest()

  doc.modifiedAt = now.toISOString()
  request.setBody(doc)
}

// ------------------------------------------------------------
// Example: Query with continuation
// ------------------------------------------------------------
export function exampleQuery(): void {
  const context = getContext()
  const collection = context.getCollection()
  const response = context.getResponse()

  const query = sampleQuery
  const options = { pageSize: 100, parameters: sampleParams }

  let results: any[] = []

  const run = (continuation: any): void => {
    const accepted = collection.queryDocuments(
      collection.getSelfLink(),
      { query, parameters: sampleParams },
      { continuation },
      (err: any, docs: any[], info: any) => {
        if (err) throw err

        results = results.concat(docs)

        if (info.continuation) {
          run(info.continuation)
        } else {
          response.setBody(results)
        }
      },
    )

    if (!accepted) throw new Error('Query not accepted by server')
  }

  run(null)
}

// ------------------------------------------------------------
// Test Case: Insert a document
// ------------------------------------------------------------
export function testInsert(): void {
  const context = getContext()
  const collection = context.getCollection()
  const response = context.getResponse()

  collection.createDocument(collection.getSelfLink(), sampleDoc, (err: any, created?: any) => {
    if (err) throw err
    response.setBody({ inserted: created })
  })
}

// ------------------------------------------------------------
// Test Case: Read a document
// ------------------------------------------------------------
export function testRead(): void {
  const context = getContext()
  const collection = context.getCollection()
  const response = context.getResponse()

  collection.readDocument(collection.getSelfLink() + '/docs/' + sampleId, (err: any, doc?: any) => {
    if (err) throw err
    response.setBody({ read: doc })
  })
}
