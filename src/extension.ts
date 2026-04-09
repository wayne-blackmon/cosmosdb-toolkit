// src/extension.ts

import * as vscode from 'vscode'
import { languages } from 'vscode'

import { CosmosCompletionProvider } from './providers/CosmosCompletionProvider'
import { CosmosSignatureProvider } from './providers/CosmosSignatureProvider'
import { CosmosHoverProvider } from './providers/CosmosHoverProvider'
import { CosmosDiagnosticsProvider } from './providers/CosmosDiagnosticsProvider'

export async function activate(context: vscode.ExtensionContext) {
  //
  // DIAGNOSTICS PROVIDER
  //
  if (context.extensionMode !== vscode.ExtensionMode.Development) {
    const diagnosticsProvider = new CosmosDiagnosticsProvider(context)
    context.subscriptions.push(diagnosticsProvider)
  }

  //
  // HOVER PROVIDER
  //
  const hoverProvider = vscode.languages.registerHoverProvider(
    ['javascript', 'typescript'],
    new CosmosHoverProvider(),
  )

  context.subscriptions.push(hoverProvider)

  //
  // COMPLETION PROVIDER
  //
  const cosmosTriggerLetters = [
    'c',
    'd',
    'g',
    'p',
    'q',
    'r',
    's',
    'u',
    'C',
    'D',
    'G',
    'P',
    'Q',
    'R',
    'S',
    'U',
  ]
  context.subscriptions.push(
    languages.registerCompletionItemProvider(
      ['javascript', 'typescript'],
      new CosmosCompletionProvider(),
      '.',
      ...cosmosTriggerLetters,
    ),
  )

  //
  // SIGNATURE HELP PROVIDER
  //
  context.subscriptions.push(
    languages.registerSignatureHelpProvider(
      [
        { language: 'javascript', scheme: 'file' },
        { language: 'typescript', scheme: 'file' },
      ],
      new CosmosSignatureProvider(),
      '(',
      ',',
      ')', // All trigger characters
    ),
  )

  //
  // SCRATCHPAD COMMAND (opens both JS + TS)
  //
  context.subscriptions.push(
    vscode.commands.registerCommand('cosmosdb-toolkit.openScratchpad', async () => {
      try {
        const jsPad = vscode.Uri.joinPath(context.extensionUri, 'scratchpad', 'scratchpad.js')
        const tsPad = vscode.Uri.joinPath(context.extensionUri, 'scratchpad', 'scratchpad.ts')

        const jsDoc = await vscode.workspace.openTextDocument(jsPad)
        await vscode.window.showTextDocument(jsDoc, { preview: false })

        const tsDoc = await vscode.workspace.openTextDocument(tsPad)
        await vscode.window.showTextDocument(tsDoc, { preview: false })

        vscode.window.setStatusBarMessage('Cosmos DB Toolkit: opened JavaScript and TypeScript scratchpads.', 3000)
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        vscode.window.showErrorMessage(`Cosmos DB Toolkit: failed to open scratchpads. ${message}`)
      }
    }),
  )

  //
  // AUTO-OPEN SCRATCHPADS IN DEV MODE
  //
  if (context.extensionMode === vscode.ExtensionMode.Development) {
    try {
      const jsPad = vscode.Uri.joinPath(context.extensionUri, 'scratchpad', 'scratchpad.js')
      const tsPad = vscode.Uri.joinPath(context.extensionUri, 'scratchpad', 'scratchpad.ts')

      const jsDoc = await vscode.workspace.openTextDocument(jsPad)
      await vscode.window.showTextDocument(jsDoc, { preview: false })

      const tsDoc = await vscode.workspace.openTextDocument(tsPad)
      await vscode.window.showTextDocument(tsDoc, { preview: false })
    } catch (err) {
      console.error('Failed to auto-open scratchpads:', err)
      const message = err instanceof Error ? err.message : String(err)
      vscode.window.showErrorMessage(`Cosmos DB Toolkit: failed to auto-open scratchpads. ${message}`)
    }
  }
}

export function deactivate() { }
