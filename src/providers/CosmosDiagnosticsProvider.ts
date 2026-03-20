import * as vscode from 'vscode'
import { cosmosApi } from './metadata/cosmosApi'

export interface ICosmosDiagnosticsProvider {
    readonly collection: vscode.DiagnosticCollection
    dispose(): void
}

export class CosmosDiagnosticsProvider implements ICosmosDiagnosticsProvider {
    readonly collection: vscode.DiagnosticCollection
    private readonly entryPoints: Set<string>

    constructor(private readonly context: vscode.ExtensionContext) {
        this.collection = vscode.languages.createDiagnosticCollection('cosmosdb-toolkit')
        this.context.subscriptions.push(this.collection)

        this.entryPoints = new Set(['getContext', 'getCollection', 'getRequest', 'getResponse'])

        // Initial pass
        vscode.workspace.textDocuments.forEach(doc => {
            if (this.isCosmosDocument(doc)) {
                this.refreshDiagnostics(doc)
            }
        })

        this.context.subscriptions.push(
            vscode.workspace.onDidOpenTextDocument(doc => {
                if (this.isCosmosDocument(doc)) {
                    this.refreshDiagnostics(doc)
                }
            }),
            vscode.workspace.onDidChangeTextDocument(e => {
                if (this.isCosmosDocument(e.document)) {
                    this.refreshDiagnostics(e.document)
                }
            }),
            vscode.workspace.onDidCloseTextDocument(doc => {
                this.collection.delete(doc.uri)
            })
        )
    }

    dispose(): void {
        this.collection.clear()
        this.collection.dispose()
    }

    private isCosmosDocument(document: vscode.TextDocument): boolean {
        // Only run diagnostics on untitled or workspace files, not extension/test internals
        if (document.uri.scheme !== 'file' && document.uri.scheme !== 'untitled') {
            return false
        }

        // Only JS/TS
        if (document.languageId !== 'javascript' && document.languageId !== 'typescript') {
            return false
        }

        // Ignore files inside node_modules, out/, test/, .vscode-test/
        const path = document.uri.fsPath.toLowerCase()
        if (
            path.includes('node_modules') ||
            path.includes('out\\test') ||
            path.includes('out/test') ||
            path.includes('.vscode-test')
        ) {
            return false
        }

        return true
    }


    private refreshDiagnostics(document: vscode.TextDocument): void {
        const diagnostics: vscode.Diagnostic[] = []
        const text = document.getText()

        this.checkMissingContext(document, text, diagnostics)
        this.checkUnknownEntryPoints(document, text, diagnostics)
        this.checkUnknownFunctions(document, text, diagnostics)

        this.collection.set(document.uri, diagnostics)
    }

    // Rule 1: Hint if no getContext() at all
    private checkMissingContext(
        document: vscode.TextDocument,
        text: string,
        diagnostics: vscode.Diagnostic[]
    ): void {
        if (!text.includes('getContext(')) {
            const range = new vscode.Range(0, 0, 0, 0)
            const diagnostic = new vscode.Diagnostic(
                range,
                'Cosmos DB server-side scripts typically start from getContext().',
                vscode.DiagnosticSeverity.Hint
            )
            diagnostic.source = 'cosmosdb-toolkit'
            diagnostics.push(diagnostic)
        }
    }

    // Rule 2: Warn on unknown getXxx() entry points
    private checkUnknownEntryPoints(
        document: vscode.TextDocument,
        text: string,
        diagnostics: vscode.Diagnostic[]
    ): void {
        // Match getXxx() calls that are not method calls (not preceded by a dot)
        const entryPointPatternString = '(?<!\\.)\\bget[A-Z][A-Za-z0-9_]*\\s*\\('
        const entryPointPattern = new RegExp(entryPointPatternString, 'g')
        let match: RegExpExecArray | null

        while ((match = entryPointPattern.exec(text)) !== null) {
            const fullMatch = match[0]
            const name = fullMatch.replace('(', '').trim()

            if (!this.entryPoints.has(name)) {
                const position = document.positionAt(match.index)
                const range = new vscode.Range(
                    position,
                    position.translate(0, name.length)
                )

                const diagnostic = new vscode.Diagnostic(
                    range,
                    `Unknown Cosmos DB entry point "${name}". Expected one of: ${Array.from(this.entryPoints).join(', ')}.`,
                    vscode.DiagnosticSeverity.Warning
                )
                diagnostic.source = 'cosmosdb-toolkit'
                diagnostics.push(diagnostic)
            }
        }
    }

    // Rule 3: Warn on unknown function calls that look like Cosmos API usage
    private checkUnknownFunctions(
        document: vscode.TextDocument,
        text: string,
        diagnostics: vscode.Diagnostic[]
    ): void {
        const functionCallPatternString = '\\b(?:[A-Za-z0-9_]+\\.)?([A-Za-z0-9_]+)\\s*\\('
        const functionCallPattern = new RegExp(functionCallPatternString, 'g')

        // Build a set of all known Cosmos function names
        const knownFunctions = new Set<string>()
        for (const group of Object.values(cosmosApi)) {
            for (const fn of group.functions) {
                knownFunctions.add(fn.label)
            }
        }

        let match: RegExpExecArray | null
        while ((match = functionCallPattern.exec(text)) !== null) {
            const name = match[1]

            // Skip entry points (handled separately)
            if (this.entryPoints.has(name)) continue

            // Skip obvious non‑API JS identifiers
            if (['function', 'if', 'for', 'while', 'return', 'switch'].includes(name)) continue

            // Skip function definitions (e.g., "function foo()" or "const foo = function()")
            const matchStart = match.index
            const beforeMatch = text.substring(Math.max(0, matchStart - 20), matchStart)
            if (/\bfunction\s+$/.test(beforeMatch) || /=\s*function\s*$/.test(beforeMatch)) {
                continue
            }

            if (!knownFunctions.has(name)) {
                const position = document.positionAt(match.index)
                const range = new vscode.Range(
                    position,
                    position.translate(0, name.length)
                )

                const diagnostic = new vscode.Diagnostic(
                    range,
                    `Unknown Cosmos DB function "${name}".`,
                    vscode.DiagnosticSeverity.Warning
                )
                diagnostic.source = 'cosmosdb-toolkit'
                diagnostics.push(diagnostic)
            }
        }
    }

}
