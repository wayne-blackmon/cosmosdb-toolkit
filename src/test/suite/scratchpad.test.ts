// src/test/suite/scratchpad.test.ts

import * as assert from 'assert'
import * as vscode from 'vscode'

suite('Scratchpad Tests', () => {
  test('openScratchpad opens the scratchpad.ts file', async () => {
    await vscode.commands.executeCommand('cosmosdb-toolkit.openScratchpad')

    const openDocs = vscode.workspace.textDocuments.map(d => d.uri.fsPath)
    assert.ok(
      openDocs.some(p => p.endsWith('scratchpad.js')),
      'Scratchpad command should open JavaScript scratchpad'
    )
    assert.ok(
      openDocs.some(p => p.endsWith('scratchpad.ts')),
      'Scratchpad command should open TypeScript scratchpad'
    )

    const editor = vscode.window.activeTextEditor
    assert.ok(editor, 'An editor should be active after running openScratchpad')

    const doc = editor!.document

    assert.strictEqual(
      doc.languageId,
      'typescript',
      'Scratchpad should open as a TypeScript file'
    )

    assert.ok(
      doc.uri.fsPath.endsWith('scratchpad.ts'),
      'Scratchpad should open the correct file'
    )
  })
})
