# Cosmos DB Toolkit for VS Code

A lightweight, metadata‑driven IntelliSense extension for Azure Cosmos DB server‑side JavaScript  
(stored procedures, triggers, and UDFs).

This toolkit provides:

- ✔ Completion suggestions for all Cosmos DB server‑side APIs
- ✔ Signature help with per-parameter documentation
- ✔ Hover tooltips powered by structured metadata, with receiver-aware disambiguation
- ✔ Diagnostics with actionable messages, diagnostic codes, and suggestions for unknown APIs
- ✔ Built‑in JavaScript and TypeScript scratchpads for rapid iteration
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

All IntelliSense is powered by structured metadata split into core API definitions and snippet variants:

- \`src/providers/metadata/cosmosApi.core.ts\`
- \`src/providers/metadata/cosmosApi.snippets.ts\`
- \`src/providers/metadata/cosmosApi.ts\` (merged export)

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

The hover provider is fully metadata‑driven and works in both file‑backed and untitled documents. It disambiguates functions that appear on multiple interfaces (for example `request.setBody` vs `response.setBody`) by inspecting the receiver in the line prefix.

### 🔹 Diagnostics Provider

Provides inline diagnostics as you type, covering three rules:

| Rule                   | Severity | Description                                                                           |
| ---------------------- | -------- | ------------------------------------------------------------------------------------- |
| Missing `getContext()` | Hint     | Flags files that never call `getContext()`, with an actionable suggestion             |
| Unknown entry point    | Warning  | Flags calls like `getBanana()` that don't match a known Cosmos DB context entry point |
| Unknown function       | Warning  | Flags unrecognised function names and suggests the closest known alternatives         |

All diagnostics carry a machine-readable `code` (`cosmosdb.missingContext`, `cosmosdb.unknownEntryPoint`, `cosmosdb.unknownFunction`) for tooling and quick-fix integration.

### 🔹 Scratchpad Command

Quickly open both JavaScript and TypeScript scratchpads for writing stored procedures:

- Command category: **Cosmos DB**
- Command title: **Cosmos DB: Open Scratchpad**
- Command ID: `cosmosdb-toolkit.openScratchpad`

The command provides a status bar confirmation on success and a user-visible error message on failure.

### 🔹 Test Suite

Located under:

- \`src/test\`

Includes:

- Completion provider tests
- Signature help provider tests
- Hover provider tests (including receiver-disambiguation regression)
- Diagnostics provider tests
- Metadata drift validation (ensures metadata matches the Cosmos SDK)
- Snippet validation (ensures all API functions have JS + TS snippet variants)
- Scratchpad tests
- Extension activation tests

Run tests with:

\`\`\`
npm test
\`\`\`

Run full pre-checkin verification (compile + lint + tests) with:

\`\`\`
npm run verify
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

```text
src/
  extension.ts

  providers/
    CosmosCompletionProvider.ts
    CosmosDiagnosticsProvider.ts
    CosmosHoverProvider.ts
    CosmosSignatureProvider.ts
    metadata/
      cosmosApi.core.ts
      cosmosApi.snippets.ts
      cosmosApi.ts
      metadataSchema.ts

  snippets/
    sprocs.ts

  test/
    runTest.ts
    suite/
      completionProvider.test.ts
      diagnosticProvider.test.ts
      extension.test.ts
      hoverProvider.test.ts
      index.ts
      metadataValidator.test.ts
      scratchpad.test.ts
      scratchpadCompletions.test.ts
      scratchpadSignatures.test.ts
      signaturePovider.test.ts
      snippetValidator.test.ts
      tabExpansion.test.ts
```

---

## Status

This extension is under active development and is approaching its first stable release.  
All IntelliSense surfaces are now metadata‑driven and fully validated.
