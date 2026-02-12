import * as path from 'path';
import * as vscode from 'vscode';

export async function activate(context: vscode.ExtensionContext) {
  console.log(
    'Congratulations, your extension "cosmosdb-toolkit" is now active!',
  );
  console.log('EXT MODE:', context.extensionMode);

  // Register the command ALWAYS (Dev, Prod, Test)
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'cosmosdb-toolkit.openScratchpad',
      async () => {
        // Build a REAL filesystem path (just like your test)
        const scratchPadFsPath = path.join(
          context.extensionUri.fsPath,
          'scratchpad',
          'scratchpad.js'
        );

        // Convert the path to a URI for VS Code
        const scratchPadUri = vscode.Uri.file(scratchPadFsPath);

        const doc = await vscode.workspace.openTextDocument(scratchPadUri);
        await vscode.window.showTextDocument(doc);
      }
    )
  );

  // Only auto-open in Dev mode
  if (context.extensionMode === vscode.ExtensionMode.Development) {
    const scratchPadFsPath = path.join(
      context.extensionUri.fsPath,
      'scratchpad',
      'scratchpad.js'
    );

    const scratchPadUri = vscode.Uri.file(scratchPadFsPath);

    try {
      const doc = await vscode.workspace.openTextDocument(scratchPadUri);
      await vscode.window.showTextDocument(doc);
    } catch (err) {
      console.error('Failed to open scratchpad:', err);
    }
  }
}

export function deactivate() {}
