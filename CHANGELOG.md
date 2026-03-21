# Changelog

All notable changes to the **cosmosdb-toolkit** extension will be documented in this file.

This project follows the principles of [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and uses semantic versioning.  
Versions are automatically incremented via the check‑in script.

---

## [Unreleased]

### Added

- Fully typed Cosmos Hover Provider with metadata‑driven documentation and signatures
- Hover provider registration for both file‑backed and untitled documents
- Deterministic hover extraction utility for test suite
- Robust hover provider test suite with Cosmos‑specific assertions

### Improved

- Updated completion and signature help metadata paths
- Hardened test suite to ignore built‑in VS Code hover providers
- Stabilized VS Code test runner behavior across untitled documents
- Diagnostics: eliminated false positives by skipping function declarations in unknown‑function rule
- Diagnostics: improved function‑call detection to avoid misidentifying local symbols as Cosmos API calls

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


