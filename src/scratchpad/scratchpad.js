// ─────────────────────────────────────────────────────────────
// Cosmos DB Toolkit Scratchpad
// This file is for local experimentation only.
// It is NOT packaged with the extension.
// ─────────────────────────────────────────────────────────────

// Suggested workflow:
// 1. Import the Cosmos DB Toolkit API
// 2. Create a client
// 3. Explore databases, containers, queries, and scripts
// 4. Use IntelliSense to discover available helpers

// Example: import the toolkit (adjust path if needed)
const cosmos = require("../out/api"); // IntelliSense should light up here

// ─────────────────────────────────────────────────────────────
// 1. Create a client
//    (Replace with your own endpoint/key or use environment variables)
// ─────────────────────────────────────────────────────────────

const client = cosmos.createClient({
    endpoint: process.env.COSMOS_ENDPOINT,
    key: process.env.COSMOS_KEY
});

// ─────────────────────────────────────────────────────────────
// 2. Quick examples to try
//    Uncomment any block below to explore functionality.
// ─────────────────────────────────────────────────────────────

// List databases
// client.listDatabases().then(console.log);

// List containers in a database
// client.database("mydb").listContainers().then(console.log);

// Query items
// client.container("mydb", "mycontainer")
//     .query("SELECT * FROM c WHERE c.type = @type", { type: "widget" })
//     .then(console.log);

// Create an item
// client.container("mydb", "mycontainer")
//     .items.create({ id: "123", type: "widget", name: "Sample" });

// ─────────────────────────────────────────────────────────────
// 3. Stored procedures, triggers, UDFs
//    Use this area to write and test scripts with IntelliSense.
// ─────────────────────────────────────────────────────────────

// Example stored procedure
/*
function sampleStoredProcedure() {
    const context = getContext();
    const container = context.getCollection();
    const response = context.getResponse();

    response.setBody({ message: "Hello from stored procedure" });
}
*/

// ─────────────────────────────────────────────────────────────
// 4. Utility helpers
// ─────────────────────────────────────────────────────────────

// Log helper
function log(title, value) {
    console.log(`\n── ${title} ──`);
    console.dir(value, { depth: 5 });
}

// ─────────────────────────────────────────────────────────────
// 5. Entry point
//    Put your experiments here.
// ─────────────────────────────────────────────────────────────

async function run() {
    // Try something simple:
    // const dbs = await client.listDatabases();
    // log("Databases", dbs);
}

run().catch(err => console.error("Scratchpad error:", err));
