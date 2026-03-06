# Cosmos DB Toolkit for VS Code

A lightweight, metadata‑driven IntelliSense extension for Azure Cosmos DB server‑side JavaScript
(stored procedures, triggers, and UDFs).

This toolkit provides:

- ✔ Completion suggestions for all Cosmos DB server‑side APIs  
- ✔ Signature help with parameter documentation  
- ✔ Structured metadata powering IntelliSense  
- ✔ A built‑in scratchpad for writing and testing stored procedures  
- ✔ A clean, deterministic test suite  

---

## Features

### 🔹 Metadata‑Driven IntelliSense

All IntelliSense is powered by a structured metadata file:

- `src/providers/metadata/cosmosApi.ts`

This includes:

- API groups (`context`, `collection`, `request`, `response`)
- Functions
- Parameters
- Overloads
- Documentation

### 🔹 Completion Provider

Automatically suggests Cosmos DB server‑side functions when typing:

- `getContext().`
- `getCollection().`
- `getRequest().`
- `getResponse().`

### 🔹 Signature Help Provider

Displays function signatures and parameter documentation when typing:

- `(`
- `,`

### 🔹 Scratchpad Command

Quickly open a JavaScript scratchpad for writing stored procedures:

- Command title: `Cosmos DB: Open Scratchpad`
- Command ID: `cosmosdb-toolkit.openScratchpad`

### 🔹 Test Suite

Located under:

- `src/test`

Includes:

- Completion provider tests  
- Signature provider tests  
- Scratchpad tests  
- Extension activation tests  

Run tests with:

- `npm test`

---

## Folder Structure

    src/
      extension.ts
      providers/
        CosmosCompletionProvider.ts
        CosmosSignatureProvider.ts
        metadata/
          cosmosApi.ts
      scratchpad/
        scratchpad.js

    test/
      runTest.ts
      suite/
        completionProvider.test.ts
        signatureProvider.test.ts
        scratchpad.test.ts
        extension.test.ts

---

## Requirements

- VS Code 1.85+
- Node 18+
- TypeScript 5+

---

## Development

Compile:

- `npm run compile`

Watch mode:

- `npm run watch`

Run tests:

- `npm test`

---

## License

MIT
