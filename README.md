# Cosmos DB Toolkit for VS Code

**The fastest way to write Azure Cosmos DB server-side JavaScript.**
IntelliSense, signatures, snippets, diagnostics, and documentation all powered by a governed metadata engine.

---

## What This Extension Does

Azure Cosmos DB's server-side JavaScript API is powerful, but historically under-documented inside the editor. Writing stored procedures, triggers, and UDFs often meant memorizing APIs or digging through old samples.

This extension fixes that.

You get:

- Smart IntelliSense for all server-side APIs
- Signature help with per-parameter documentation
- Hover docs with clear explanations
- Snippets for common stored procedure patterns
- Diagnostics for unknown or incorrect API usage
- Scratchpads for rapid stored procedure development
- Support for both JavaScript and TypeScript

All IntelliSense surfaces are powered by a typed, validated metadata file aligned with the official Cosmos DB SDK.

---

## Quickstart

### 1. Install the extension

Search for **Cosmos DB Toolkit** in the VS Code Marketplace.

### 2. Open a stored procedure file

Create a `.js` or `.ts` file and start typing:

```javascript
const ctx = getContext()
const col = ctx.getCollection()

col.queryDocuments(col.getSelfLink(), 'SELECT * FROM c', {}, (err, docs) => {
  if (err) throw err
  ctx.getResponse().setBody(docs)
})
```

You'll immediately see completions, signature help, hover documentation, and diagnostics.

### 3. Use the Scratchpad

Open the Command Palette and run:

```text
Cosmos DB: Open Scratchpad
```

This opens a ready-to-use JavaScript or TypeScript scratchpad for rapid iteration.

---

## How to Use the Cosmos DB Toolkit

This section walks through writing Cosmos DB stored procedures, triggers, and UDFs using IntelliSense, signatures, snippets, and diagnostics.

It covers:

- Supported server-side APIs
- Types of stored procedures
- How to use snippets
- How to write a stored procedure from scratch
- How IntelliSense helps at every step

---

## 1. Supported Cosmos DB Server-Side APIs

The toolkit includes full IntelliSense coverage for all documented server-side JavaScript APIs.

### Context API (`IContext`)

- `getContext()`
- `getCollection()`
- `getRequest()`
- `getResponse()`

### Collection API (`ICollection`)

- `queryDocuments(link, filter, options, callback)`
- `readDocument(link, options, callback)`
- `createDocument(link, body, options, callback)`
- `replaceDocument(link, body, options, callback)`
- `deleteDocument(link, options, callback)`
- `readAttachments(link, options, callback)`
- `createAttachment(link, body, options, callback)`
- `queryAttachments(link, filter, options, callback)`
- And all other documented server-side collection methods

### Request API (`IRequest`)

- `getBody()`
- `getValue()`
- `setBody(body)`
- `setValue(value)`

### Response API (`IResponse`)

- `setBody(body)`
- `setStatusCode(code)`
- `getBody()`
- `getStatusCode()`

Every method includes completions, signature help, hover documentation, and JavaScript and TypeScript snippet variants.

---

## 2. Types of Stored Procedures You Can Build

Cosmos DB supports several stored procedure patterns. The toolkit includes snippets and IntelliSense for all of them.

- Basic stored procedure
- Query loop stored procedure with continuation token handling
- Bulk insert stored procedure
- Hybrid read, write, and query stored procedure
- Pre-trigger and post-trigger
- User-defined functions (UDFs)

Each pattern has a snippet prefix such as `cosmos.sproc`, `cosmos.bulk.insert`, `cosmos.query.loop`, `cosmos.trigger.pre`, or `cosmos.udf`.

---

## 3. Creating a Stored Procedure Using Snippets

Snippets are the fastest way to start writing Cosmos DB server-side code.

### Step 1: Create a `.js` or `.ts` file

Example: `mySproc.js`

### Step 2: Type the snippet prefix

```text
cosmos.sproc
```

### Step 3: Press Tab

You get a ready-to-edit template:

```javascript
function sampleSproc() {
  const context = getContext()
  const collection = context.getCollection()
  const response = context.getResponse()

  response.setBody('Hello from Cosmos DB!')
}
```

### Step 4: Fill in your logic

As you type:

- IntelliSense suggests valid API calls
- Signature help shows parameter details
- Hover docs explain each method
- Diagnostics warn about unknown APIs or missing `getContext()`

---

## 4. Example: Query Loop Stored Procedure

Type:

```text
cosmos.query.loop
```

Press Tab:

```javascript
function queryLoop() {
  const context = getContext()
  const collection = context.getCollection()
  const response = context.getResponse()

  const query = 'SELECT * FROM c'
  const results = []

  const run = (continuation) => {
    const options = { continuation }
    const isAccepted = collection.queryDocuments(
      collection.getSelfLink(),
      query,
      options,
      (err, docs, token) => {
        if (err) throw err

        results.push(...docs)

        if (token) {
          run(token)
        } else {
          response.setBody(results)
        }
      },
    )

    if (!isAccepted) {
      response.setBody('Request not accepted by server.')
    }
  }

  run()
}
```

---

## 5. Example: Bulk Insert Stored Procedure

Type:

```text
cosmos.bulk.insert
```

Press Tab:

```javascript
function bulkInsert(docs) {
  const context = getContext()
  const collection = context.getCollection()
  const response = context.getResponse()

  let count = 0

  const insertNext = () => {
    if (count >= docs.length) {
      response.setBody({ inserted: count })
      return
    }

    const isAccepted = collection.createDocument(
      collection.getSelfLink(),
      docs[count],
      {},
      (err) => {
        if (err) throw err
        count++
        insertNext()
      },
    )

    if (!isAccepted) {
      response.setBody({ inserted: count })
    }
  }

  insertNext()
}
```

---

## 6. Example: Trigger

Type either:

```text
cosmos.trigger.pre
cosmos.trigger.post
```

```javascript
function preTrigger() {
  const request = getContext().getRequest()
  const body = request.getBody()

  body.timestamp = new Date().toISOString()

  request.setBody(body)
}
```

---

## 7. Example: UDF

Type:

```text
cosmos.udf
```

```javascript
function udf(input) {
  return input.toUpperCase()
}
```

---

## 8. How IntelliSense Helps While You Type

As you write:

- `getContext().` shows all context methods
- `collection.` shows all collection methods
- `setBody(` shows signature and documentation
- Hovering any method shows metadata-driven docs
- Unknown API names produce diagnostics with suggestions

This makes Cosmos DB server-side development dramatically easier.

---

## Features

- IntelliSense for all server-side APIs
- Signature help with parameter documentation
- Hover documentation with related APIs
- Diagnostics for unknown or incorrect API usage
- Snippets for every API in JavaScript and TypeScript
- Scratchpads for rapid development

---

## Documentation and Contributing

See the project docs:

- [CONTRIBUTING.md](./CONTRIBUTING.md)
- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [TESTING.md](./TESTING.md)

---

## Support Development

If this extension improves your workflow, you can support ongoing development here:

<https://www.paypal.com/donate/?hosted_button_id=PN9F8GZ75NUAW>

---

## Status

The extension is under active development. All IntelliSense surfaces are metadata-driven and validated against the Cosmos DB SDK.
