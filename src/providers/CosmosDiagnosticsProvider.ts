// src/providers/CosmosDiagnosticsProvider.ts

import * as vscode from 'vscode'
import { cosmosApi } from './metadata/cosmosApi'

export interface ICosmosDiagnosticsProvider {
  readonly collection: vscode.DiagnosticCollection
  dispose(): void
}

export class CosmosDiagnosticsProvider implements ICosmosDiagnosticsProvider {
  readonly collection: vscode.DiagnosticCollection
  private readonly entryPoints: Set<string>
  private readonly knownFunctions: Set<string>
  private readonly knownFunctionList: string[]

  constructor(private readonly context: vscode.ExtensionContext) {
    this.collection = vscode.languages.createDiagnosticCollection('cosmosdb-toolkit')
    this.context.subscriptions.push(this.collection)

    this.entryPoints = new Set(['getContext', 'getCollection', 'getRequest', 'getResponse'])
    this.knownFunctions = new Set<string>()
    for (const group of Object.values(cosmosApi)) {
      for (const fn of group.functions) {
        this.knownFunctions.add(fn.label)
      }
    }
    this.knownFunctionList = Array.from(this.knownFunctions).sort()

    //
    // Initial pass – only on Cosmos-relevant documents
    //
    vscode.workspace.textDocuments.forEach((doc) => {
      if (this.isCosmosDocument(doc)) {
        this.refreshDiagnostics(doc)
      }
    })

    //
    // Live updates – only on Cosmos-relevant documents
    //
    this.context.subscriptions.push(
      vscode.workspace.onDidOpenTextDocument((doc) => {
        if (this.isCosmosDocument(doc)) {
          this.refreshDiagnostics(doc)
        }
      }),
      vscode.workspace.onDidChangeTextDocument((e) => {
        if (this.isCosmosDocument(e.document)) {
          this.refreshDiagnostics(e.document)
        }
      }),
      vscode.workspace.onDidCloseTextDocument((doc) => {
        this.collection.delete(doc.uri)
      }),
    )
  }

  dispose(): void {
    this.collection.clear()
    this.collection.dispose()
  }

  /**
   * Decide whether this document is even eligible for Cosmos diagnostics.
   *
   * Hard rules:
   * - Only workspace/untitled documents (no vscode://, output://, etc.)
   * - Only .js, .sql, .json (Cosmos server-side artifacts)
   * - Never analyze the extension’s own source / build / test files
   */
  private isCosmosDocument(document: vscode.TextDocument): boolean {
    const { uri } = document

    // Only run diagnostics on untitled or workspace files, not virtual/output/etc.
    if (uri.scheme !== 'file' && uri.scheme !== 'untitled') {
      return false
    }

    const fsPath = uri.fsPath.toLowerCase()

    // File-type gate: Cosmos server-side artifacts are JS/SQL/JSON, not TS.
    // Untitled documents use languageId instead of file extension.
    if (uri.scheme === 'untitled') {
      if (document.languageId !== 'javascript' && document.languageId !== 'sql') {
        return false
      }
    } else if (
      !fsPath.endsWith('.js') &&
      !fsPath.endsWith('.sql') &&
      !fsPath.endsWith('.json')
    ) {
      return false
    }

    // Ignore common non-user-code locations
    if (
      fsPath.includes('node_modules') ||
      fsPath.includes('out\\test') ||
      fsPath.includes('out/test') ||
      fsPath.includes('.vscode-test')
    ) {
      return false
    }

    // Never analyze the extension’s own implementation / metadata / scratchpads
    if (
      fsPath.includes('\\src\\') ||
      fsPath.includes('/src/') ||
      fsPath.includes('\\providers\\') ||
      fsPath.includes('/providers/') ||
      fsPath.includes('\\metadata\\') ||
      fsPath.includes('/metadata/') ||
      fsPath.includes('\\scratchpad\\') ||
      fsPath.includes('/scratchpad/')
    ) {
      return false
    }

    return true
  }

  private refreshDiagnostics(document: vscode.TextDocument): void {
    // Absolute safety: if this ever gets called directly, still respect the gate.
    if (!this.isCosmosDocument(document)) {
      this.collection.delete(document.uri)
      return
    }

    // Skip diagnostics for scratchpads (defensive, in case paths change)
    if (document.uri.path.includes('scratchpad')) {
      this.collection.set(document.uri, [])
      return
    }

    const text = document.getText()
    // Untitled documents (scratchpad-like workflow) are always treated as Cosmos scripts.
    // For file-based documents, apply the heuristic to avoid false positives.
    if (document.uri.scheme !== 'untitled' && !this.isLikelyCosmosScript(text)) {
      this.collection.set(document.uri, [])
      return
    }

    try {
      const diagnostics: vscode.Diagnostic[] = []

      this.checkMissingContext(document, text, diagnostics)
      this.checkUnknownEntryPoints(document, text, diagnostics)
      this.checkUnknownFunctions(document, text, diagnostics)

      this.collection.set(document.uri, diagnostics)
    } catch {
      // Clear stale diagnostics so the file doesn't show phantom errors
      this.collection.delete(document.uri)
    }
  }

  /**
   * Heuristic: does this text look like a Cosmos server-side script?
   *
   * We intentionally avoid treating generic "context" / "request" variables
   * as Cosmos receivers, to prevent false positives on VS Code extension code.
   */
  private isLikelyCosmosScript(text: string): boolean {
    // Strong signal: direct entry-point call
    const hasEntryPointCall = /\b(?:getContext|getCollection|getRequest|getResponse)\s*\(/.test(text)
    if (hasEntryPointCall) {
      return true
    }

    // Secondary signal: entry-point result used as a receiver
    // e.g., getContext().getCollection(), getContext().getResponse(), etc.
    const hasCosmosReceiverCall =
      /\b(?:getContext\(\)|getCollection\(\)|getRequest\(\)|getResponse\(\))\s*\.\s*[A-Za-z_$][\w$]*\s*\(/.test(
        text,
      )

    return hasCosmosReceiverCall
  }

  // Rule 1: Hint if no getContext() at all
  private checkMissingContext(
    document: vscode.TextDocument,
    text: string,
    diagnostics: vscode.Diagnostic[],
  ): void {
    if (!text.includes('getContext(')) {
      const firstLineLength = document.lineCount > 0 ? document.lineAt(0).text.length : 1
      const range = new vscode.Range(0, 0, 0, Math.max(1, firstLineLength))
      const diagnostic = new vscode.Diagnostic(
        range,
        'Cosmos DB server-side scripts typically start from getContext(). Add `const context = getContext()` near the top of the script.',
        vscode.DiagnosticSeverity.Hint,
      )
      diagnostic.source = 'cosmosdb-toolkit'
      diagnostic.code = 'cosmosdb.missingContext'
      diagnostics.push(diagnostic)
    }
  }

  // Rule 2: Warn on unknown getXxx() entry points
  private checkUnknownEntryPoints(
    document: vscode.TextDocument,
    text: string,
    diagnostics: vscode.Diagnostic[],
  ): void {
    const entryPointPatternString = '(?<!\\.)\\bget[A-Z][A-Za-z0-9_]*\\s*\\('
    const entryPointPattern = new RegExp(entryPointPatternString, 'g')
    let match: RegExpExecArray | null

    while ((match = entryPointPattern.exec(text)) !== null) {
      const fullMatch = match[0]
      const name = fullMatch.replace('(', '').trim()

      if (!this.entryPoints.has(name)) {
        const position = document.positionAt(match.index)
        const range = new vscode.Range(position, position.translate(0, name.length))

        const diagnostic = new vscode.Diagnostic(
          range,
          `Unknown Cosmos DB entry point "${name}". Expected one of: ${Array.from(this.entryPoints).join(', ')}.`,
          vscode.DiagnosticSeverity.Warning,
        )
        diagnostic.source = 'cosmosdb-toolkit'
        diagnostic.code = 'cosmosdb.unknownEntryPoint'
        diagnostics.push(diagnostic)
      }
    }
  }

  // Rule 3: Warn on unknown function calls that look like Cosmos API usage
  private checkUnknownFunctions(
    document: vscode.TextDocument,
    text: string,
    diagnostics: vscode.Diagnostic[],
  ): void {
    const functionCallPatternString =
      '\\b(getContext\\(\\)|getCollection\\(\\)|getRequest\\(\\)|getResponse\\(\\)|context|collection|request|response|ctx|coll|col|req|res)\\s*\\.\\s*([A-Za-z0-9_]+)\\s*\\('
    const functionCallPattern = new RegExp(functionCallPatternString, 'g')

    let match: RegExpExecArray | null
    while ((match = functionCallPattern.exec(text)) !== null) {
      const name = match[2]

      if (this.entryPoints.has(name)) continue
      if (['function', 'if', 'for', 'while', 'return', 'switch'].includes(name)) continue

      const matchStart = match.index
      const beforeMatch = text.substring(Math.max(0, matchStart - 20), matchStart)
      if (/\bfunction\s+$/.test(beforeMatch) || /=\s*function\s*$/.test(beforeMatch)) {
        continue
      }

      if (!this.knownFunctions.has(name)) {
        const position = document.positionAt(match.index)
        const range = new vscode.Range(position, position.translate(0, name.length))
        const suggestions = this.knownFunctionList.filter(
          (known) =>
            known.toLowerCase().startsWith(name.toLowerCase().slice(0, 1)) ||
            known.toLowerCase().includes(name.toLowerCase()),
        )
        const suggestionSuffix =
          suggestions.length > 0
            ? ` Did you mean: ${suggestions.slice(0, 4).join(', ')}?`
            : ' Use IntelliSense to browse supported Cosmos DB APIs.'

        const diagnostic = new vscode.Diagnostic(
          range,
          `Unknown Cosmos DB function "${name}".${suggestionSuffix}`,
          vscode.DiagnosticSeverity.Warning,
        )
        diagnostic.source = 'cosmosdb-toolkit'
        diagnostic.code = 'cosmosdb.unknownFunction'
        diagnostic.relatedInformation = [
          new vscode.DiagnosticRelatedInformation(
            new vscode.Location(document.uri, range),
            `Known Cosmos DB functions: ${this.knownFunctionList.join(', ')}`,
          ),
        ]
        diagnostics.push(diagnostic)
      }
    }
  }
}
