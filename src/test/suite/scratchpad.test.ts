// src/test/suite/scratchpad.test.ts

import * as assert from 'assert'
import * as vscode from 'vscode'

suite('Scratchpad Tests', () => {
  test('openScratchpad opens the scratchpad.js file', async () => {
    await vscode.commands.executeCommand('cosmosdb-toolkit.openScratchpad')

    const editor = vscode.window.activeTextEditor
    assert.ok(editor, 'An editor should be active after running openScratchpad')

    const doc = editor!.document

    assert.strictEqual(
      doc.languageId,
      'javascript',
      'Scratchpad should open as a JavaScript file'
    )

    assert.ok(
      doc.uri.fsPath.endsWith('scratchpad.js'),
      'Scratchpad should open the correct file'
    )
  })
})
