# Changelog

All notable changes to the **cosmosdb-toolkit** extension will be documented in this file.

This project follows the principles of [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and uses semantic versioning.  
Versions are automatically incremented via the check‑in script.

---

## [Unreleased]

## [0.1.4] - 2026-03-24

### Added
- Version bump via check-in script.

## [0.1.3] - 2026-03-24

### Added
- Version bump via check-in script.

## [0.1.2] - 2026-03-24

### Added

- Version bump via check-in script.

- Fully typed Cosmos Hover Provider with metadata‑driven documentation and signatures
- Hover provider registration for both file‑backed and untitled documents
- Deterministic hover extraction utility for test suite
- Robust hover provider test suite with Cosmos‑specific assertions
- `npm run verify` workflow (compile + lint + tests)
- Dedicated regression coverage for completion replacement ranges in dotted prefix contexts
- Restored Signature Provider test suite with stable temp-file fixtures

### Improved

- Updated completion and signature help metadata paths
- Hardened test suite to ignore built‑in VS Code hover providers
- Stabilized VS Code test runner behavior across untitled documents
- Diagnostics: eliminated false positives by skipping function declarations in unknown‑function rule
- Diagnostics: improved function‑call detection to avoid misidentifying local symbols as Cosmos API calls
- Sorting in completion options by API group type (context, collection, request, response) and snippet vs function priority
- Corrected scratchpad test to assert TypeScript scratchpad path/language when open command focuses ts file
- Completion replacement range handling now replaces full dotted prefixes (for example `collection.`)
- JavaScript scratchpad template updated to avoid module export syntax in server-side script examples
- Scratchpad command test now asserts both JavaScript and TypeScript scratchpads are opened

### Existing Features

- Initial release of the Cosmos DB Toolkit extension
- Scratchpad auto‑open in Development Mode
- Command palette integration (\`cosmosdb-toolkit.openScratchpad\`)
- Deterministic activation model (Dev / Prod / Test)
- Cross‑platform test suite stabilization
- Advanced VS Code testing setup (Mocha bootstrap, suite/index, deterministic ordering)
- Metadata‑driven IntelliSense for Cosmos DB server‑side API
  - Completion Provider (context, collection, request, response)
  - Signature Help Provider with overload + parameter documentation
- Versioning pipeline using \`VERSION\` + automated CHANGELOG insertion


