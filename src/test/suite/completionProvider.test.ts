import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Completion Provider Tests', () => {
  test('completion provider should return items for context API', async () => {
    const doc = await vscode.workspace.openTextDocument({
      content: 'context.',
      language: 'javascript'
    });

    const pos = new vscode.Position(0, 8);
    const list = await vscode.commands.executeCommand<vscode.CompletionList>(
      'vscode.executeCompletionItemProvider',
      doc.uri,
      pos
    );

    assert.ok(list, 'Completion list should exist');
    assert.ok(list!.items.length > 0, 'Completion list should contain items');
  });
});