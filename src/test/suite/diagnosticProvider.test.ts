import * as assert from 'assert'
import * as vscode from 'vscode'

suite('Cosmos Diagnostics Provider', () => {
  test('Warns when getContext() is missing', async () => {
    const doc = await vscode.workspace.openTextDocument({
      language: 'javascript',
      content: `
        function foo() {
          return 42;
        }
      `,
    })

    await vscode.window.showTextDocument(doc)

    // Allow diagnostics to run
    await new Promise((resolve) => setTimeout(resolve, 200))

    const diagnostics = vscode.languages.getDiagnostics(doc.uri)
    assert.ok(
      diagnostics.some((d) => d.message.includes('getContext')),
      'Expected missing getContext() diagnostic',
    )
  })

  test('Warns on unknown entry points', async () => {
    const doc = await vscode.workspace.openTextDocument({
      language: 'javascript',
      content: `
        function run() {
          const ctx = getBanana();
        }
      `,
    })

    await vscode.window.showTextDocument(doc)
    await new Promise((resolve) => setTimeout(resolve, 200))

    const diagnostics = vscode.languages.getDiagnostics(doc.uri)

    assert.ok(
      diagnostics.some((d) => d.message.includes('Unknown Cosmos DB entry point')),
      'Expected unknown entry point diagnostic',
    )
  })

  test('Warns on unknown Cosmos functions (metadata-driven)', async () => {
    const doc = await vscode.workspace.openTextDocument({
      language: 'javascript',
      content: `
        function run() {
          getContext();
          doSomethingNotReal(123);
        }
      `,
    })

    await vscode.window.showTextDocument(doc)
    await new Promise((resolve) => setTimeout(resolve, 200))

    const diagnostics = vscode.languages.getDiagnostics(doc.uri)

    assert.ok(
      diagnostics.some((d) => d.message.includes('Unknown Cosmos DB function')),
      'Expected unknown function diagnostic',
    )
  })

  test('Does NOT warn on known Cosmos functions', async () => {
    const doc = await vscode.workspace.openTextDocument({
      language: 'javascript',
      content: `
        function run() {
          const ctx = getContext();
          const coll = ctx.getCollection();
          coll.queryDocuments('foo', {}, () => {});
        }
      `,
    })

    await vscode.window.showTextDocument(doc)
    await new Promise((resolve) => setTimeout(resolve, 200))

    const diagnostics = vscode.languages.getDiagnostics(doc.uri)

    const unknowns = diagnostics.filter((d) => d.message.includes('Unknown Cosmos DB function'))

    assert.strictEqual(
      unknowns.length,
      0,
      'Expected no unknown function diagnostics for valid Cosmos API calls',
    )
  })

  test('Does NOT warn on method calls like request.getBody()', async () => {
    const doc = await vscode.workspace.openTextDocument({
      language: 'javascript',
      content: `
        function run() {
          const ctx = getContext();
          const req = ctx.getRequest();
          const body = req.getBody();
          const res = ctx.getResponse();
          res.setBody(body);
        }
      `,
    })

    await vscode.window.showTextDocument(doc)
    await new Promise((resolve) => setTimeout(resolve, 200))

    const diagnostics = vscode.languages.getDiagnostics(doc.uri)

    const entryPointWarnings = diagnostics.filter((d) =>
      d.message.includes('Unknown Cosmos DB entry point'),
    )

    assert.strictEqual(
      entryPointWarnings.length,
      0,
      'Expected no entry point warnings for valid method calls',
    )
  })
})
