// Cosmos DB Scratchpad
// Write stored procedures, triggers, or UDFs here.
// IntelliSense is powered by the extension's metadata.

// ---------------------------------------------------------------------------
// Parameter Variables (assigned values)
// ---------------------------------------------------------------------------

let docId = "myDocId";
let partitionKey = "myPartitionKey";

let docBody = { type: "sample", value: 42 };

let query = "SELECT * FROM c WHERE c.type = @type";
let params = [{ name: "@type", value: "sample" }];

let options = { enableScanInQuery: true, maxItemCount: 10 };

let limit = 100;
let continuation = null;

let collectionLink = "dbs/mydb/colls/mycoll";

function callback(err, resources, responseOptions) {
  if (err) throw err;
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
  const context = getContext();
  const collection = context.getCollection();
  const request = context.getRequest();
  const response = context.getResponse();

  collection.queryDocuments(collectionLink, )
  collection.createDocument(collectionLink, )

  // Query documents
  // collection.queryDocuments(
  //   collectionLink,
  //   { query, parameters: params },
  //   options,
  //   callback
  // );

  // Create a document
  // collection.createDocument(collectionLink, docBody, options, callback);

  // Read a document
  // collection.readDocument(documentLink, options, callback);

  // response.setBody(input);
}
