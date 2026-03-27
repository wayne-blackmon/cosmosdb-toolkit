# Contributing to Cosmos DB Toolkit

Thank you for your interest in contributing to the Cosmos DB Toolkit.  
This project provides a metadata‑driven developer experience for authoring Cosmos DB server‑side scripts in Visual Studio Code.

This guide explains how to set up the project, run the extension, work with metadata, run tests, and submit contributions.

---

## Project Setup

1. Clone the repository:
   \`git clone <https://github.com/wayne-blackmon/cosmosdb-toolkit\`>

2. Install dependencies:
   \`npm install\`

3. Open the project in Visual Studio Code.

---

## Running the Extension

1. Open the project in VS Code.  
2. Press **F5** to launch the Extension Host.  
3. A new VS Code window will open with the extension loaded.

---

## Linting and Formatting

Run lint:

\`npm run lint\`

Automatically fix issues:

\`npm run lint -- --fix\`

A clean lint baseline is required for all pull requests.

---

## Running Tests

Run all tests:

\`npm test\`

Tests include:

- Provider behavior (hover, completion, signature help)
- Metadata validation against the Cosmos DB SDK
- Extension activation tests

See **TESTING.md** for details on interpreting validator output.

---

## Metadata Governance

All IntelliSense, signatures, snippets, and documentation come from:

\`src/providers/metadata/cosmosApi.ts\`

This file is the single source of truth.

A validator test ensures metadata stays aligned with the Cosmos DB SDK.

---

## Adding or Updating Metadata

1. Edit \`cosmosApi.ts\`.  
2. Follow the existing structure.  
3. Run tests:  
   \`npm test\`  
4. Follow validator suggestions if drift is detected.

---

## Adding Snippets (JS and TS)

Snippets are defined inside metadata entries under the \`snippet\` field.

Each snippet includes:

- prefix  
- description  
- body  

---

## Submitting Pull Requests

Before submitting a PR:

- Ensure lint passes  
- Ensure all tests pass  
- Ensure metadata validator passes  
- Include a clear description of the change  

---

## Code of Conduct

All contributors are expected to interact respectfully and constructively.
