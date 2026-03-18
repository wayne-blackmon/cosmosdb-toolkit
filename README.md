# Cosmos DB Toolkit for VS Code

A lightweight, metadata‑driven IntelliSense extension for Azure Cosmos DB server‑side JavaScript
(stored procedures, triggers, and UDFs).

This toolkit provides:

- ✔ Completion suggestions for all Cosmos DB server‑side APIs  
- ✔ Signature help with parameter documentation  
- ✔ Hover tooltips powered by structured metadata  
- ✔ A built‑in scratchpad for writing and testing stored procedures  
- ✔ A clean, deterministic test suite  

---

## Features

### 🔹 Metadata‑Driven IntelliSense

All IntelliSense is powered by a structured metadata file:

- `src/metadata/cosmosApi.ts`

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

### 🔹 Hover Provider

Shows rich documentation and signatures when hovering over:

- `getContext`
- `queryDocuments`
- `createDocument`
- `setStatusCode`
- …and all other Cosmos DB server‑side APIs

The hover provider is fully metadata‑driven and works in both file‑backed and untitled documents.

### 🔹 Scratchpad Command

Quickly open a JavaScript scratchpad for writing stored procedures:

- Command title: `Cosmos DB: Open Scratchpad`
- Command ID: `cosmosdb-toolkit.openScratchpad`

### 🔹 Test Suite

Located under:

- `src/test`

Includes:

- Completion provider tests  
- Signature help provider tests  
- Hover provider tests  
- Scratchpad tests  
- Extension activation tests  

Run tests with:

- `npm test`

---

## Folder Structure