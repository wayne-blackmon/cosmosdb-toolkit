// src/test/suite/completionProvider.test.ts

import * as assert from 'assert'
import * as vscode from 'vscode'

function getReplacementRange(item: vscode.CompletionItem): vscode.Range | undefined {
  if (!item.range) return undefined
  if (item.range instanceof vscode.Range) return item.range
  return item.range.replacing
}

suite('Completion Provider Tests', function () {
  this.timeout(10000)

  test('context API completions appear after getContext().', async () => {
    const content = 'getContext().'
    const doc = await vscode.workspace.openTextDocument({
      content,
      language: 'javascript',
    })

    const pos = new vscode.Position(0, content.length)

    const list = await vscode.commands.executeCommand<vscode.CompletionList>(
      'vscode.executeCompletionItemProvider',
      doc.uri,
      pos,
    )

    assert.ok(list, 'Completion list should exist')
    assert.ok(list!.items.length > 0, 'Completion list should contain items')

    const labels = list!.items.map((i) => i.label)

    assert.ok(labels.includes('getCollection'))
    assert.ok(labels.includes('getResponse'))
  })

  test('collection API completions appear after getCollection().', async () => {
    const content = 'getCollection().'
    const doc = await vscode.workspace.openTextDocument({
      content,
      language: 'javascript',
    })

    const pos = new vscode.Position(0, content.length)

    const list = await vscode.commands.executeCommand<vscode.CompletionList>(
      'vscode.executeCompletionItemProvider',
      doc.uri,
      pos,
    )

    assert.ok(list, 'Completion list should exist')
    assert.ok(list!.items.length > 0, 'Completion list should contain items')

    const labels = list!.items.map((i) => i.label)

    assert.ok(labels.includes('queryDocuments'))
    assert.ok(labels.includes('createDocument'))
  })

  //
  // ────────────────────────────────────────────────────────────────
  // Context-Sensitive Sorting Tests
  // ────────────────────────────────────────────────────────────────
  //
  suite('Context-Sensitive Sorting Tests', () => {
    test('collection methods appear first when typing "collection."', async () => {
      const content = 'collection.'
      const doc = await vscode.workspace.openTextDocument({
        content,
        language: 'javascript',
      })

      const pos = new vscode.Position(0, content.length)

      const list = await vscode.commands.executeCommand<vscode.CompletionList>(
        'vscode.executeCompletionItemProvider',
        doc.uri,
        pos,
      )

      assert.ok(list, 'Completion list should exist')
      assert.ok(list!.items.length > 0, 'Completion list should contain items')

      // Get the first few items to check ordering
      const topItems = list!.items.slice(0, 5)
      const topLabels = topItems.map((i) => i.label.toString())

      // Collection methods should appear first
      assert.ok(
        topLabels.some(
          (label) => label.includes('queryDocuments') || label.includes('createDocument'),
        ),
        'Collection-specific methods should appear in top results',
      )
    })

    test('context methods appear first when typing "context."', async () => {
      const content = 'const context = getContext()\ncontext.'
      const doc = await vscode.workspace.openTextDocument({
        content,
        language: 'javascript',
      })

      const pos = new vscode.Position(1, 8) // After "context."

      const list = await vscode.commands.executeCommand<vscode.CompletionList>(
        'vscode.executeCompletionItemProvider',
        doc.uri,
        pos,
      )

      assert.ok(list, 'Completion list should exist')
      assert.ok(list!.items.length > 0, 'Completion list should contain items')

      // Get the first few items to check ordering
      const topItems = list!.items.slice(0, 5)
      const topLabels = topItems.map((i) => i.label.toString())

      // Context methods should appear first
      assert.ok(
        topLabels.some((label) => label === 'getCollection' || label === 'getResponse'),
        'Context-specific methods should appear in top results',
      )
    })

    test('sproc snippets have high priority in function context', async () => {
      const content = 'export function mySproc() {\n  '
      const doc = await vscode.workspace.openTextDocument({
        content,
        language: 'javascript',
      })

      const pos = new vscode.Position(1, 2) // After the space

      const list = await vscode.commands.executeCommand<vscode.CompletionList>(
        'vscode.executeCompletionItemProvider',
        doc.uri,
        pos,
      )

      assert.ok(list, 'Completion list should exist')

      // Sproc snippets should be highly prioritized in function context
      const sprocItems = list!.items.filter((i) => i.label.toString().startsWith('cosmos.sproc'))

      assert.ok(sprocItems.length > 0, 'Should include sproc snippets')

      // Check that they have high priority sortText
      const firstSprocItem = sprocItems[0]
      assert.ok(
        firstSprocItem.sortText! <= '0002',
        'Sproc snippets should have high priority in function context',
      )
    })

    test('dotted prefix replacement range covers full token', async () => {
      const content = 'collection.'
      const doc = await vscode.workspace.openTextDocument({
        content,
        language: 'javascript',
      })

      const pos = new vscode.Position(0, content.length)

      const list = await vscode.commands.executeCommand<vscode.CompletionList>(
        'vscode.executeCompletionItemProvider',
        doc.uri,
        pos,
      )

      assert.ok(list, 'Completion list should exist')

      const item = list!.items.find((i) => i.label.toString() === 'queryDocuments')
      assert.ok(item, 'queryDocuments completion should exist in collection context')

      const range = getReplacementRange(item!)
      assert.ok(range, 'Completion item should include a replacement range')
      assert.strictEqual(
        range!.start.character,
        0,
        'Range should start at beginning of dotted token',
      )
      assert.strictEqual(
        range!.end.character,
        content.length,
        'Range should end at cursor position',
      )
    })
  })
  suite('Snippet Completion Tests', () => {
    test('sproc snippets appear when typing "sproc"', async () => {
      const content = 'sproc'
      const doc = await vscode.workspace.openTextDocument({
        content,
        language: 'javascript',
      })

      const pos = new vscode.Position(0, content.length)

      const list = await vscode.commands.executeCommand<vscode.CompletionList>(
        'vscode.executeCompletionItemProvider',
        doc.uri,
        pos,
      )

      const labels = list!.items.map((i) => i.label.toString())

      assert.ok(
        labels.some((l) => l.startsWith('cosmos.sproc')),
        'Should include sproc snippet completions',
      )
    })

    test('continuation snippet appears when typing "continuation"', async () => {
      const content = 'continuation'
      const doc = await vscode.workspace.openTextDocument({
        content,
        language: 'javascript',
      })

      const pos = new vscode.Position(0, content.length)

      const list = await vscode.commands.executeCommand<vscode.CompletionList>(
        'vscode.executeCompletionItemProvider',
        doc.uri,
        pos,
      )

      const labels = list!.items.map((i) => i.label.toString())

      assert.ok(
        labels.includes('cosmos.sproc.continuation'),
        'Should include continuation-loop sproc snippet',
      )
    })

    test('UDF snippet appears when typing "udf"', async () => {
      const content = 'udf'
      const doc = await vscode.workspace.openTextDocument({
        content,
        language: 'javascript',
      })

      const pos = new vscode.Position(0, content.length)

      const list = await vscode.commands.executeCommand<vscode.CompletionList>(
        'vscode.executeCompletionItemProvider',
        doc.uri,
        pos,
      )

      const labels = list!.items.map((i) => i.label.toString())

      assert.ok(labels.includes('cosmos.udf'), 'Should include UDF snippet')
    })
  })
})
