import * as assert from "assert";
import * as vscode from "vscode";

suite("Extension Tests", () => {
  test("extension activates", async () => {
    const extension = vscode.extensions.getExtension(
      "wayne-blackmon.cosmosdb-toolkit",
    );
    assert.ok(extension, "Extension should be found");

    await extension?.activate();
    assert.ok(extension?.isActive, "Extension should be active");

    vscode.commands.registerCommand("cosmosdb.openScratchpad", async () => {
      const doc = await vscode.workspace.openTextDocument({
        language: "javascript",
        content: "",
      });
      await vscode.window.showTextDocument(doc);
    });
  });
});
