// Cosmos DB Scratchpad
// Write stored procedures, triggers, or UDFs here.
// IntelliSense is powered by the extension's metadata.

// ---------------------------------------------------------------------------
// Virtual API namespace for IntelliSense
// ---------------------------------------------------------------------------

// @ts-ignore
const cosmos = globalThis.__cosmosToolkitApi || {};

// ---------------------------------------------------------------------------
// Stored Procedure Template
// ---------------------------------------------------------------------------

/**
 * Example stored procedure
 * @param {any} input - Input payload
 */
function sampleSproc(input) {
  const context = cosmos.server.context();
  const collection = context.getCollection();
  const response = context.getResponse();

  const ctx = cosmos.server.context();
  const coll = ctx.getCollection();

  // Write your logic here
  // response.setBody({ ok: true, input });
}
