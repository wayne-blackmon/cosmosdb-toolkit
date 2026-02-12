import * as vscode from "vscode";

export async function activate(context: vscode.ExtensionContext) {
  console.log(
    'Congratulations, your extension "cosmosdb-toolkit" is now active!',
  );
  console.log("EXT MODE:", context.extensionMode);

  // Register the command ALWAYS (Dev, Prod, Test)
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "cosmosdb-toolkit.openScratchpad",
      async () => {
        const scratchPadPath = vscode.Uri.joinPath(
          context.extensionUri,
          "src",
          "scratchpad",
          "scratchpad.js",
        );
        const doc = await vscode.workspace.openTextDocument(scratchPadPath);
        await vscode.window.showTextDocument(doc);
      },
    ),
  );

  // Only auto-open in Dev mode
  if (context.extensionMode === vscode.ExtensionMode.Development) {
    const scratchPadPath = vscode.Uri.joinPath(
      context.extensionUri,
      "src",
      "scratchpad",
      "scratchpad.js",
    );

    try {
      const doc = await vscode.workspace.openTextDocument(scratchPadPath);
      await vscode.window.showTextDocument(doc);
    } catch (err) {
      console.error("Failed to open scratchpad:", err);
    }
  }
}

// This method is called when your extension is deactivated
export function deactivate() {}
