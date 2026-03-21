/// <reference path="../src/types/cosmos.d.ts" />

// Cosmos DB Scratchpad (TypeScript)
// Write stored procedures, triggers, or UDFs here.
// IntelliSense + Hover are powered by the extension's metadata.

// ---------------------------------------------------------------------------
// Parameter Variables (assigned values)
// ---------------------------------------------------------------------------

let docId: string = 'myDocId'
let partitionKey: string = 'myPartitionKey'

let docBody: any = { type: 'sample', value: 42 }

let query: string = 'SELECT * FROM c WHERE c.type = @type'
let params: { name: string; value: any }[] = [{ name: '@type', value: 'sample' }]

let options: IRequestOptions = { enableScanInQuery: true, maxItemCount: 10 }

let limit: number = 100
let continuation: string | null = null

let collectionLink: string = 'dbs/mydb/colls/mycoll'
let documentLink: string = 'dbs/mydb/colls/mycoll/docs/myDocId'

function callback(
  err: IError,
  resources: any,
  responseOptions: IFeedCallbackInfo
): void {
  if (err) throw err
  // Handle results here
}

// ---------------------------------------------------------------------------
// Stored Procedure Template
// ---------------------------------------------------------------------------

/**
 * Example stored procedure
 * @param input - Input payload
 */
export function sampleSproc(input: any): void {
  const context: IContext = getContext()
  const collection: ICollection = context.getCollection()
  const request: IRequest = context.getRequest()
  const response: IResponse = context.getResponse()

  // -----------------------------------------------------------------------
  // Query documents
  // Hover over: queryDocuments
  // -----------------------------------------------------------------------
  collection.queryDocuments(
    collectionLink,
    { query, parameters: params },
    options,
    callback
  )

  // -----------------------------------------------------------------------
  // Create a document
  // Hover over: createDocument
  // -----------------------------------------------------------------------
  // collection.createDocument(collectionLink, docBody, options, callback)
  collection.createDocument(collectionLink, docBody, options)

  // -----------------------------------------------------------------------
  // Read a document
  // Hover over: readDocument
  // -----------------------------------------------------------------------
  // collection.readDocument(documentLink, options, callback)

  // -----------------------------------------------------------------------
  // Replace a document
  // Hover over: replaceDocument
  // -----------------------------------------------------------------------
  // collection.replaceDocument(documentLink, docBody, options, callback)

  // -----------------------------------------------------------------------
  // Delete a document
  // Hover over: deleteDocument
  // -----------------------------------------------------------------------
  // collection.deleteDocument(documentLink, options, callback)

  // -----------------------------------------------------------------------
  // Upsert a document
  // Hover over: upsertDocument
  // -----------------------------------------------------------------------
  // collection.upsertDocument(collectionLink, docBody, options, callback)
  collection.upsertDocument(collectionLink, docBody, options)

  // -----------------------------------------------------------------------
  // Request + Response API
  // Hover over: getBody, setBody, getValue, setValue, setStatusCode
  // -----------------------------------------------------------------------
  const body = request.getBody()
  request.setBody({ updated: true })

  const value = request.getValue()
  request.setValue('new value')

  response.setStatusCode(200)
  response.setBody({ ok: true, input })
}
