// src/test/suite/completionProvider.test.ts

import * as assert from 'assert'
import * as vscode from 'vscode'

suite('Completion Provider Tests', () => {
  test('context API completions appear after getContext().', async () => {
    const doc = await vscode.workspace.openTextDocument({
      content: 'getContext().',
      language: 'javascript',
    })

    const pos = new vscode.Position(0, 12)

    const list = await vscode.commands.executeCommand<vscode.CompletionList>(
      'vscode.executeCompletionItemProvider',
      doc.uri,
      pos,
    )

    assert.ok(list, 'Completion list should exist')
    assert.ok(list!.items.length > 0, 'Completion list should contain items')

    const labels = list!.items.map((i) => i.label)

    assert.ok(
      labels.includes('getCollection'),
      'Should include getCollection from context API',
    )

    assert.ok(
      labels.includes('getResponse'),
      'Should include getResponse from context API',
    )
  })

  test('collection API completions appear after getCollection().', async () => {
    const doc = await vscode.workspace.openTextDocument({
      content: 'getCollection().',
      language: 'javascript',
    })

    const pos = new vscode.Position(0, 16)

    const list = await vscode.commands.executeCommand<vscode.CompletionList>(
      'vscode.executeCompletionItemProvider',
      doc.uri,
      pos,
    )

    assert.ok(list, 'Completion list should exist')
    assert.ok(list!.items.length > 0, 'Completion list should contain items')

    const labels = list!.items.map((i) => i.label)

    assert.ok(
      labels.includes('queryDocuments'),
      'Should include queryDocuments from collection API',
    )

    assert.ok(
      labels.includes('createDocument'),
      'Should include createDocument from collection API',
    )
  })
})
