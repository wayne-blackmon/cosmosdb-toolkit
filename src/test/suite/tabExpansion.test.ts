// src/test/suite/tabExpansion.test.ts

import * as assert from 'assert'
import * as vscode from 'vscode'

suite('Tab Expansion Tests', () => {
    test('sproc snippet expands with Tab', async () => {
        const content = 'sproc'
        const doc = await vscode.workspace.openTextDocument({
            content,
            language: 'javascript'
        })

        // Explicitly set language for completion provider to match
        await vscode.languages.setTextDocumentLanguage(doc, 'javascript')

        const editor = await vscode.window.showTextDocument(doc)
        const pos = new vscode.Position(0, content.length)
        editor.selection = new vscode.Selection(pos, pos)

        // Trigger completions
        const list = await vscode.commands.executeCommand<vscode.CompletionList>(
            'vscode.executeCompletionItemProvider',
            doc.uri,
            pos
        )

        assert.ok(list, 'Completion list should exist')

        // ⭐ FIX: match real snippet labels
        const item = list.items.find(i =>
            i.label.toString().startsWith('cosmos.sproc')
        )

        assert.ok(item, 'Should include a cosmos.sproc snippet')

        // Verify snippet content has placeholder tabstops
        const insertText = item.insertText
        const snippetValue = (insertText instanceof vscode.SnippetString)
            ? insertText.value
            : insertText?.toString() ?? ''

        assert.ok(
            snippetValue.includes('${1'),
            'Snippet should contain placeholder tabstops'
        )

        // Verify it's preselected for tab expansion
        assert.ok(item.preselect === true, 'Snippet should be preselected for Tab expansion')
        assert.ok(
            item.commitCharacters?.includes('\t'),
            'Snippet should commit on Tab character'
        )
    })
})
