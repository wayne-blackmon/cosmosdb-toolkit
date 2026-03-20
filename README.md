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

## Why This Toolkit Exists

Cosmos DB’s server‑side JavaScript API is powerful but historically under‑documented inside the editor.  
This extension solves that by providing:

- A **typed metadata schema** describing every API function  
- A **drift‑validated metadata file** aligned with the Cosmos SDK  
- IntelliSense surfaces (completion, hover, signature help) that stay correct over time  
- A **scratchpad workflow** for rapid stored procedure development  

The result is a predictable, developer‑friendly experience for anyone writing Cosmos DB server‑side code.

---

## Features

### 🔹 Metadata‑Driven IntelliSense

All IntelliSense is powered by a structured metadata file:

- \`src/providers/metadata/cosmosApi.ts\`

A typed metadata schema defines the structure for all API groups, functions, signatures, and parameters:

- \`src/providers/metadata/metadataSchema.ts\`

This includes:

- API groups (\`context\`, \`collection\`, \`request\`, \`response\`)  
- Functions  
- Parameters  
- Overloads  
- Documentation  

### 🔹 Completion Provider

Automatically suggests Cosmos DB server‑side functions when typing:

- \`getContext().\`  
- \`getCollection().\`  
- \`getRequest().\`  
- \`getResponse().\`  

### 🔹 Signature Help Provider

Displays function signatures and parameter documentation when typing:

- \`(\`  
- \`,\`  

### 🔹 Hover Provider

Shows rich documentation and signatures when hovering over:

- \`getContext\`  
- \`queryDocuments\`  
- \`createDocument\`  
- \`setStatusCode\`  
- …and all other Cosmos DB server‑side APIs  

The hover provider is fully metadata‑driven and works in both file‑backed and untitled documents.

### 🔹 Scratchpad Command

Quickly open a JavaScript scratchpad for writing stored procedures:

- Command title: **Cosmos DB: Open Scratchpad**  
- Command ID: \`cosmosdb-toolkit.openScratchpad\`  

### 🔹 Test Suite

Located under:

- \`src/test\`

Includes:

- Completion provider tests  
- Signature help provider tests  
- Hover provider tests  
- Metadata drift validation (ensures metadata matches the Cosmos SDK)  
- Scratchpad tests  
- Extension activation tests  

Run tests with:

\`\`\`
npm test
\`\`\`

---

## Getting Started

1. Install dependencies  
   \`\`\`
   npm install
   \`\`\`

2. Build the extension  
   \`\`\`
   npm run compile
   \`\`\`

3. Launch the extension in VS Code  
   - Press **F5** to open a new Extension Development Host

4. Open the scratchpad  
   - Run **Cosmos DB: Open Scratchpad** from the Command Palette

---

## Development Workflow

This project uses a deterministic, test‑gated workflow:

- All code is typed and validated against the metadata schema  
- Metadata drift tests ensure alignment with the Cosmos SDK  
- The test suite must pass before check‑in  
- Versioning and CHANGELOG updates are automated via the check‑in script  

Folder structure:

\`\`\`
src
│ extension.ts
│
├── providers
│   ├── CosmosCompletionProvider.ts
│   ├── CosmosHoverProvider.ts
│   ├── CosmosSignatureProvider.ts
│   └── metadata
│       ├── cosmosApi.ts
│       └── metadataSchema.ts
│
└── test
    ├── runTest.ts
    └── suite
        ├── completionProvider.test.ts
        ├── extension.test.ts
        ├── hoverProvider.test.ts
        ├── index.ts
        ├── scratchpad.test.ts
        └── signatureProvider.test.ts
\`\`\`

---

## Status

This extension is under active development and is approaching its first stable release.  
All IntelliSense surfaces are now metadata‑driven and fully validated.
