// scratchpad/scratchpad.js
// JavaScript Cosmos DB server-side scratchpad
// Works with JS snippet variants (no TypeScript syntax)

// ------------------------------------------------------------
// Setup: common variables used across test cases
// ------------------------------------------------------------
var now = new Date()
var sampleId = 'myDocId'
var samplePartition = 'myPartition'
var sampleDoc = { id: sampleId, pk: samplePartition, value: 42 }
var sampleQuery = 'SELECT * FROM c WHERE c.pk = @pk'
var sampleParams = [{ name: '@pk', value: samplePartition }]

// ------------------------------------------------------------
// Stored Procedure Template
// ------------------------------------------------------------
function sprocName(input) {
  const context = getContext()
  const collection = context.getCollection()
  const response = context.getResponse()

  // TODO: implement logic
  response.setBody({ ok: true, input })
}

// ------------------------------------------------------------
// Example: Simple Sproc
// ------------------------------------------------------------
function exampleSproc(input) {
  const context = getContext()
  const collection = context.getCollection()
  const response = context.getResponse()

  response.setBody({ ok: true, input })
}

// ------------------------------------------------------------
// Example: Trigger
// ------------------------------------------------------------
function exampleTrigger(doc) {
  const context = getContext()
  const request = context.getRequest()

  doc.modifiedAt = now.toISOString()
  request.setBody(doc)
}

// ------------------------------------------------------------
// Example: Query with continuation
// ------------------------------------------------------------
function exampleQuery() {
  const context = getContext()
  const collection = context.getCollection()
  const response = context.getResponse()

  const query = sampleQuery
  const options = { pageSize: 100, parameters: sampleParams }

  var results = []

  var run = function (continuation) {
    var accepted = collection.queryDocuments(
      collection.getSelfLink(),
      { query, parameters: sampleParams },
      { continuation },
      function (err, docs, info) {
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
function testInsert() {
  const context = getContext()
  const collection = context.getCollection()
  const response = context.getResponse()
  const request = context.getRequest()

  collection.createDocument(collection.getSelfLink(), sampleDoc, function (err, created) {
    if (err) throw err
    response.setBody({ inserted: created })
  })
}

// ------------------------------------------------------------
// Test Case: Read a document
// ------------------------------------------------------------
function testRead() {
  const context = getContext()
  const collection = context.getCollection()
  const response = getContext().getResponse()

  collection.readDocument(collection.getSelfLink() + '/docs/' + sampleId, function (err, doc) {
    if (err) throw err
    response.setBody({ read: doc })
  })
}
