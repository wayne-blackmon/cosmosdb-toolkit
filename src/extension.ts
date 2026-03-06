// src/extension.ts

import * as path from 'path'
import * as vscode from 'vscode'
import { languages } from 'vscode'

import { CosmosCompletionProvider } from './providers/CosmosCompletionProvider'
import { CosmosSignatureProvider } from './providers/CosmosSignatureProvider'

export async function activate(context: vscode.ExtensionContext) {
  console.log('cosmosdb-toolkit activated')
  console.log('Extension mode:', context.extensionMode)

  //
  // COMPLETION PROVIDER
  //
  context.subscriptions.push(
    languages.registerCompletionItemProvider(
      ['javascript', 'typescript'],
      new CosmosCompletionProvider(),
      '.', // Trigger on dot
    ),
  )

  //
  // SIGNATURE HELP PROVIDER (FIXED)
  //
  console.log('Registering signature provider')

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
  // SCRATCHPAD COMMAND
  //
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'cosmosdb-toolkit.openScratchpad',
      async () => {
        const scratchPadFsPath = path.join(
          context.extensionUri.fsPath,
          'scratchpad',
          'scratchpad.js',
        )

        const scratchPadUri = vscode.Uri.file(scratchPadFsPath)
        const doc = await vscode.workspace.openTextDocument(scratchPadUri)
        await vscode.window.showTextDocument(doc)
      },
    ),
  )

  //
  // AUTO-OPEN SCRATCHPAD IN DEV MODE
  //
  if (context.extensionMode === vscode.ExtensionMode.Development) {
    try {
      const scratchPadFsPath = path.join(
        context.extensionUri.fsPath,
        'scratchpad',
        'scratchpad.js',
      )

      const scratchPadUri = vscode.Uri.file(scratchPadFsPath)
      const doc = await vscode.workspace.openTextDocument(scratchPadUri)
      await vscode.window.showTextDocument(doc)
    } catch (err) {
      console.error('Failed to auto-open scratchpad:', err)
    }
  }
}

export function deactivate() {}
