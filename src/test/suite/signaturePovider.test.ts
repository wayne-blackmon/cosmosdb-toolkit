// src/test/suite/signatureProvider.test.ts

import * as assert from 'assert'
import * as vscode from 'vscode'
import * as path from 'path'
import * as fs from 'fs'

suite('Signature Provider Tests', () => {
  const testFilePath = path.join(__dirname, 'signatureTest.js')

  suiteSetup(() => {
    fs.writeFileSync(
      testFilePath,
`function run() {
  getContext().getCollection().createDocument(
);
}`
    )
  })

  suiteTeardown(() => {
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath)
    }
  })

  test('Signature help appears for createDocument(', async () => {
    const opened = await vscode.workspace.openTextDocument(testFilePath)
    const doc = await vscode.languages.setTextDocumentLanguage(opened, 'javascript')
    await vscode.window.showTextDocument(doc)

    const lineIndex = 1
    const line = doc.lineAt(lineIndex).text
    const charIndex = line.indexOf('createDocument(') + 'createDocument('.length

    const pos = new vscode.Position(lineIndex, charIndex)

    const sig = await vscode.commands.executeCommand<vscode.SignatureHelp>(
      'vscode.executeSignatureHelpProvider',
      doc.uri,
      pos
    )

    assert.ok(sig, 'SignatureHelp should exist')
    assert.ok(sig!.signatures.length > 0, 'Should contain at least one signature')

    const signature = sig!.signatures[0]
    assert.strictEqual(signature.parameters.length, 4)
  })
})
