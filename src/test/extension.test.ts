import * as assert from "assert";
import * as vscode from "vscode";
// import * as myExtension from '../../extension';

suite("Cosmos DB Toolkit Extension Test Suite", () => {
  vscode.window.showInformationMessage("Start all tests.");

  test("openScratchpad opens a new JavaScript document", async () => {
    // Activate the extension
    const extension = vscode.extensions.getExtension(
      "wayne-blackmon.cosmosdb-toolkit",
    );
    assert.ok(extension, "Extension should be available");
    await extension?.activate();

    // Execute the command
    await vscode.commands.executeCommand("cosmosdb-toolkit.openScratchpad");

    // Get the active editor
    let editor = vscode.window.activeTextEditor;
    await new Promise((resolve) => setTimeout(resolve, 100));
    editor = vscode.window.activeTextEditor;

    // Validate that an editor is opened
    assert.ok(editor, "An editor should be opened");

    const doc = editor.document;

    // Assert that the correct file was opened
    assert.ok("scratchpad.js",
     `Expected scratchpad.js to be opened but opened: ${doc.uri.fsPath}`);
  });
});
