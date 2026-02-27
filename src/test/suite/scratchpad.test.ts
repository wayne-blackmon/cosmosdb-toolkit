import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Scratchpad Tests', () => {
  test('openScratchpad opens a new JavaScript document', async () => {
    await vscode.commands.executeCommand('cosmosdb-toolkit.openScratchpad');

    const editor = vscode.window.activeTextEditor;
    assert.ok(editor, 'An editor should be active');

    const doc = editor!.document;
    assert.strictEqual(doc.languageId, 'javascript', 'Scratchpad should be a JavaScript file');
  });
});