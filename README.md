# 🌌 Cosmos DB Toolkit for VS Code

**Cosmos DB Toolkit** is a developer‑focused extension that streamlines authoring, testing, and managing Azure Cosmos DB server‑side JavaScript artifacts — including **stored procedures**, **triggers**, and **user‑defined functions (UDFs)**.

It provides a frictionless scratchpad workflow, IntelliSense for the Cosmos DB server‑side API, and a clean development experience designed for iterative experimentation.

---

## ✨ Features

### 🔧 Cosmos DB Scratchpad

A dedicated workspace for writing and experimenting with Cosmos DB server‑side JavaScript.

- Auto‑opens in **Development Mode**
- Always available via the command palette:
  - **Cosmos DB Toolkit: Open Scratchpad**
- Backed by a real file (`src/scratchpad/scratchpad.js`) for stability and version control

### 💡 IntelliSense for Cosmos DB Server‑Side API

Smart completions for:

- `getContext()`
- `getCollection()`
- `getResponse()`
- Stored procedure patterns
- Trigger and UDF scaffolding

### 🧪 Test‑Friendly Architecture

- Extension activates cleanly in Test Mode (`EXT MODE: 3`)
- Scratchpad auto‑open disabled during tests
- Deterministic command behavior

### 🛠 Developer‑First Design

- Clean activation model
- Predictable file paths
- Cross‑platform test suite
- Deterministic versioning pipeline using `VERSION` + `CHANGELOG.md`

---

## 📦 Requirements

No external dependencies are required to use the scratchpad or IntelliSense features.

For deploying stored procedures or triggers, you may optionally use:

- Azure CLI  
- Azure Cosmos DB account  
- Azure extension for VS Code  

---

## ⚙️ Extension Settings

This extension contributes the following command:

| Command                           | Description                         |
|-----------------------------------|-------------------------------------|
| `cosmosdb-toolkit.openScratchpad` | Opens the Cosmos DB scratchpad file |

Additional configuration options will be added as the extension evolves.

---

## 🐞 Known Issues

- IntelliSense coverage is focused on server‑side JavaScript APIs; additional APIs will be added incrementally.
- Scratchpad auto‑open is limited to Development Mode by design.

---

## 📝 Release Notes

### v0.0.1

- Initial activation model  
- Scratchpad auto‑open in Dev Mode  
- Command palette integration  
- Test suite stabilization  
- Deterministic versioning pipeline  

---

## 📚 Following Extension Guidelines

This extension follows the official VS Code extension authoring guidelines:

- Activation events are minimal and explicit  
- Commands are registered unconditionally  
- Dev Mode behavior is isolated from Production and Test modes  

---

## ✍️ Working with Markdown

VS Code includes excellent Markdown authoring tools:

- Split editor: `Ctrl+\`
- Preview: `Ctrl+Shift+V`
- IntelliSense: `Ctrl+Space`

---

## 🔗 Additional Resources

- [VS Code Extension Docs](https://code.visualstudio.com/api)
- [Azure Cosmos DB Documentation](https://learn.microsoft.com/azure/cosmos-db/)
- [Markdown Guide](https://www.markdownguide.org/basic-syntax/)
