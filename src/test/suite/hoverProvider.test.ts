import * as assert from 'assert'
import * as vscode from 'vscode'
import { cosmosApi } from '../../providers/metadata/cosmosApi'

suite('CosmosHoverProvider', () => {
  test('Hover appears for known API functions', async () => {
    const doc = await vscode.workspace.openTextDocument({
      language: 'javascript',
      content: `
        function test() {
          const context = getContext()
          context.getCollection()
        }
      `
    })

    const editor = await vscode.window.showTextDocument(doc)

    // Place cursor on getCollection
    const position = new vscode.Position(3, 25)
    editor.selection = new vscode.Selection(position, position)

    const hovers = await vscode.commands.executeCommand<vscode.Hover[]>(
      'vscode.executeHoverProvider',
      doc.uri,
      position
    )

    assert.ok(hovers, 'Expected hover results')
    assert.ok(hovers.length > 0, 'Expected at least one hover result')

    const apiEntry = cosmosApi.context.functions.find(f => f.label === 'getCollection')
    assert.ok(apiEntry, 'Metadata entry for getCollection should exist')

    // VS Code may return built-in JS hover info alongside our extension hover.
    // Filter for the hover entry coming from our Cosmos provider by matching the expected label.
    const cosmosHover = hovers.find((h) => {
      const text = h.contents
        .map(c => {
          if (typeof c === 'string') return c
          if (c instanceof vscode.MarkdownString) return c.value
          if ('value' in c) return c.value
          return ''
        })
        .join('\n')
      return text.includes(apiEntry.label)
    })

    assert.ok(cosmosHover, 'Expected Cosmos hover result')

    const hoverText = cosmosHover!.contents
      .map(c => {
        if (typeof c === 'string') return c
        if (c instanceof vscode.MarkdownString) return c.value
        if ('value' in c) return c.value
        return ''
      })
      .join('\n')

    assert.ok(
      hoverText.includes(apiEntry.label),
      'Hover should include function label'
    )

    assert.ok(
      hoverText.includes(apiEntry.documentation),
      'Hover should include documentation'
    )

    const sig = apiEntry.signatures[0]
    const params = sig.parameters
      .map(p => `${p.name}${p.optional ? '?' : ''}: ${p.type}`)
      .join(', ')

    assert.ok(
      hoverText.includes(`(${params}) => ${sig.returns}`),
      'Hover should include signature'
    )
  })

  test('No hover appears for unknown identifiers', async function () {
    this.timeout(10000)
    const doc = await vscode.workspace.openTextDocument({
      language: 'javascript',
      content: `
        function test() {
          const foo = barBazQux
        }
      `
    })

    const editor = await vscode.window.showTextDocument(doc)

    const position = new vscode.Position(2, 25)
    editor.selection = new vscode.Selection(position, position)

    const hovers = (await vscode.commands.executeCommand<vscode.Hover[]>(
      'vscode.executeHoverProvider',
      doc.uri,
      position
    )) || []

    assert.ok(Array.isArray(hovers), 'Expected hover results array')

    const cosmosHover = hovers.find((h) => {
      const text = h.contents
        .map(c => {
          if (typeof c === 'string') return c
          if (c instanceof vscode.MarkdownString) return c.value
          if ('value' in c) return c.value
          return ''
        })
        .join('\n')

      return cosmosApi.context.functions.some((f) => text.includes(f.label))
    })

    assert.strictEqual(cosmosHover, undefined, 'Expected no Cosmos hover for unknown symbol')
  })
})