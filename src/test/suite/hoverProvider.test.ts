// src/test/providers/CosmosHoverProvider.test.ts

import * as assert from 'assert'
import * as vscode from 'vscode'
import { cosmosApi } from '../../providers/metadata/cosmosApi'

suite('CosmosHoverProvider (compact)', () => {
  test('Hover appears for known API functions', async () => {
    const doc = await vscode.workspace.openTextDocument({
      language: 'javascript',
      content: `
        function test() {
          const context = getContext()
          context.getCollection()
        }
      `,
    })

    const editor = await vscode.window.showTextDocument(doc)

    const position = new vscode.Position(3, 25)
    editor.selection = new vscode.Selection(position, position)

    const hovers = await vscode.commands.executeCommand<vscode.Hover[]>(
      'vscode.executeHoverProvider',
      doc.uri,
      position,
    )

    assert.ok(hovers && hovers.length > 0)

    const apiEntry = cosmosApi.context.functions.find((f) => f.label === 'getCollection')
    assert.ok(apiEntry)

    const cosmosHover = hovers.find((h) => {
      const text = h.contents
        .map((c) => (c instanceof vscode.MarkdownString ? c.value : String(c)))
        .join('\n')
      return text.includes(apiEntry.label)
    })

    assert.ok(cosmosHover)

    const hoverText = cosmosHover.contents
      .map((c) => (c instanceof vscode.MarkdownString ? c.value : String(c)))
      .join('\n')

    assert.ok(hoverText.includes(apiEntry.label))
    assert.ok(hoverText.includes(apiEntry.documentation!))
    assert.ok(hoverText.includes('```ts'))
    assert.ok(hoverText.includes(apiEntry.signatures[0].label))
  })

  test('Function hover includes known parameter details', async () => {
    const doc = await vscode.workspace.openTextDocument({
      language: 'javascript',
      content: `
        function test() {
          getContext().getCollection().queryDocuments('x', 'y', {}, (err, docs, info) => {})
        }
      `,
    })

    const editor = await vscode.window.showTextDocument(doc)

    const position = new vscode.Position(2, 39)
    editor.selection = new vscode.Selection(position, position)

    const hovers = await vscode.commands.executeCommand<vscode.Hover[]>(
      'vscode.executeHoverProvider',
      doc.uri,
      position,
    )

    const hoverText = hovers
      .flatMap((h) => h.contents)
      .map((c) => (c instanceof vscode.MarkdownString ? c.value : String(c)))
      .join('\n')

    assert.ok(hoverText.includes('queryDocuments'))
    assert.ok(hoverText.includes('collectionLink: string'))
    assert.ok(hoverText.includes('query: string | SqlQuerySpec'))
    assert.ok(
      hoverText.includes(
        'callback: (err: IError, docs: RetrievedDocument[], info: IFeedCallbackInfo) => void',
      ),
    )
  })

  test('No hover appears for unknown identifiers', async () => {
    const doc = await vscode.workspace.openTextDocument({
      language: 'javascript',
      content: `
        function test() {
          const foo = barBazQux
        }
      `,
    })

    const editor = await vscode.window.showTextDocument(doc)

    const position = new vscode.Position(2, 25)
    editor.selection = new vscode.Selection(position, position)

    const hovers =
      (await vscode.commands.executeCommand<vscode.Hover[]>(
        'vscode.executeHoverProvider',
        doc.uri,
        position,
      )) || []

    const cosmosHover = hovers.find((h) => {
      const text = h.contents
        .map((c) => (c instanceof vscode.MarkdownString ? c.value : String(c)))
        .join('\n')

      return cosmosApi.context.functions.some((f) => text.includes(f.label))
    })

    assert.strictEqual(cosmosHover, undefined)
  })
})
