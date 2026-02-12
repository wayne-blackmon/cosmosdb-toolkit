import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Cosmos DB Toolkit Extension Test Suite', () => {
  vscode.window.showInformationMessage('Start all tests.');

  test('openScratchpad opens a new JavaScript document', async () => {
    const extension = vscode.extensions.getExtension(
      'wayne-blackmon.cosmosdb-toolkit',
    );
    assert.ok(extension, 'Extension should be available');
    await extension.activate();

    await vscode.commands.executeCommand('cosmosdb-toolkit.openScratchpad');

    // Give VS Code a moment to open the editor
    await new Promise((resolve) => setTimeout(resolve, 150));

    const editor = vscode.window.activeTextEditor;
    assert.ok(editor, 'An editor should be opened');

    const doc = editor.document;

    // The scratchpad should always be JavaScript
    assert.strictEqual(
      doc.languageId,
      'javascript',
      'Scratchpad should be a JavaScript document',
    );
  });
});
