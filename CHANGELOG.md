# ![Cosmos DB Toolkit logo](assets/icon/icon-light.png#gh-light-mode-only) ![Cosmos DB Toolkit logo](assets/icon/icon-dark.png#gh-dark-mode-only) Changelog

All notable changes to the **cosmosdb-toolkit** extension will be documented in this file.

This project follows the principles of [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and uses semantic versioning.  
Versions are automatically incremented via the check‑in script.

---

## [Unreleased]

## [0.2.1] - 2026-03-25

### Added
- Version bump via check-in script.

## [0.2.0] - 2026-03-25

### Changed

- Added extension icon assets and manifest wiring:
  - Top-level extension icon now points to `assets/icon/icon-dark.png`
  - `cosmosdb-toolkit.openScratchpad` command now uses theme-aware icons:
    - Light: `assets/icon/icon-light.png`
    - Dark: `assets/icon/icon-dark.png`
- Refined hover content rendering for a cleaner, safer default:
  - Hover markdown is now rendered with `isTrusted = false`
  - Function hovers now prioritize the primary signature and concise description text
  - Removed extra hover sections (header, notes, related list, and snippet block) from the default hover surface
- Repository root cleanup:
  - `checkin.ps1` and `publish.ps1` moved to `scripts/`
  - `links.txt` moved to `assets/`
  - Removed obsolete `.eslintrc.json` (superseded by `eslint.config.mjs`)

## [0.1.9] - 2026-03-25

### Added

- Version bump via check-in script.

## [0.1.8] - 2026-03-25

- Version bump via check-in script.

## [0.1.7] - 2026-03-25

- Version bump via check-in script.

## [0.1.6] - 2026-03-25

- Version bump via check-in script.

## [0.1.5] - 2026-03-25

- Version bump via check-in script.
- **Diagnostics Provider** — new inline diagnostic rules with actionable messages and machine-readable codes:
  - `cosmosdb.missingContext`: hints when `getContext()` is absent, with a remediation suggestion
  - `cosmosdb.unknownEntryPoint`: warns on unrecognised `getXxx()` calls and lists valid alternatives
  - `cosmosdb.unknownFunction`: warns on unknown Cosmos API calls and suggests similar known names
  - `relatedInformation` on unknown-function diagnostics listing all known functions
- **`getSelfLink` API metadata** — added to `ICollection` group with full documentation, snippet variants, examples, related functions, and notes; eliminates false-positive diagnostics for `collection.getSelfLink()`
- **Per-parameter documentation** — all `ICollection`, `IRequest`, and `IResponse` signature parameters now carry `documentation` text, populating the signature help parameter detail panel
- **Collection function metadata** — `related`, `notes`, and `examples` fields added to `createDocument`, `readDocument`, `replaceDocument`, `deleteDocument`, and `upsertDocument`
- **Snippet completion documentation** — `item.documentation` now set on all snippet completion items so the completion widget detail panel is populated for keyboard and screen reader users
- **Command category** — `"category": "Cosmos DB"` added to `package.json` for proper Command Palette grouping
- **Hover disambiguation regression test** — locks fix for `request.setBody` vs `response.setBody` hover collision

### Fixed

- **Hover cache language bug** — cache key now includes `languageId`; JS and TS snippet variants no longer cross-contaminate after the first cache hit
- **`setBody`/`getBody` hover collision** — hover provider now resolves the correct `IRequest` or `IResponse` variant by inspecting the receiver object in the line prefix (`request.`, `req.`, `response.`, `res.`, etc.)
- **Zero-length missing-context diagnostic range** — range now spans the first line, producing a visible squiggle navigable via F8 and announced by screen readers
- **Hover header markup** — `fn.label` is now rendered as a `##` heading rather than plain text, restoring heading semantics for screen readers
- **Notes rendering** — multiple notes are now rendered as a markdown list instead of a run-on sentence
- **Related functions** — backtick wrapping removed from `Related:` list to reduce screen reader verbosity
- **Diagnostics event handler protection** — `refreshDiagnostics` wrapped in try/catch; on error, stale diagnostics are cleared rather than leaving the handler silently broken for the session
- **Scratchpad command feedback** — command now shows a status bar confirmation on success and a `showErrorMessage` notification on failure; dev-mode auto-open also surfaces errors to the user

### Removed

- Dev-only `console.log` calls from `extension.ts` (`'cosmosdb-toolkit activated'`, `'Extension mode'`, `'Registering signature provider'`)

## [0.1.4] - 2026-03-24

- Version bump via check-in script.

## [0.1.3] - 2026-03-24

- Version bump via check-in script.

## [0.1.2] - 2026-03-24

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
- Command palette integration (`cosmosdb-toolkit.openScratchpad`)
- Deterministic activation model (Dev / Prod / Test)
- Cross‑platform test suite stabilization
- Advanced VS Code testing setup (Mocha bootstrap, suite/index, deterministic ordering)
- Metadata‑driven IntelliSense for Cosmos DB server‑side API
  - Completion Provider (context, collection, request, response)
  - Signature Help Provider with overload + parameter documentation
- Versioning pipeline using `VERSION` + automated CHANGELOG insertion

