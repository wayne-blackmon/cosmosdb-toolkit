// Cosmos DB Scratchpad
// Write stored procedures, triggers, or UDFs here.
// IntelliSense + Hover are powered by the extension's metadata.

// ---------------------------------------------------------------------------
// Parameter Variables (assigned values)
// ---------------------------------------------------------------------------

let docId = 'myDocId'
let partitionKey = 'myPartitionKey'

let docBody = { type: 'sample', value: 42 }

let query = 'SELECT * FROM c WHERE c.type = @type'
let params = [{ name: '@type', value: 'sample' }]

let options = { enableScanInQuery: true, maxItemCount: 10 }

let limit = 100
let continuation = null

let collectionLink = 'dbs/mydb/colls/mycoll'
let documentLink = 'dbs/mydb/colls/mycoll/docs/myDocId'

function callback(err, resources, responseOptions) {
  if (err) throw err
  // Handle results here
}

// ---------------------------------------------------------------------------
// Stored Procedure Template
// ---------------------------------------------------------------------------

/**
 * Example stored procedure
 * @param {any} input - Input payload
 */
function sampleSproc(input) {
  const context = getContext()
  const collection = context.getCollection()
  const request = context.getRequest()
  const response = context.getResponse()

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

  // -----------------------------------------------------------------------
  // Request + Response API
  // Hover over: getBody, setBody, getValue, setValue, setStatusCode
  // -----------------------------------------------------------------------
  // const body = request.getBody()
  // request.setBody({ updated: true })
  const body = request.getBody()
  request.setBody({ updated: true })

  // const value = request.getValue()
  // request.setValue('new value')
  const value = request.getValue()
  request.setValue('new value')

  // response.setStatusCode(200)
  // response.setBody({ ok: true, input })
  response.setStatusCode(200)
  response.setBody({ ok: true, input })
}
