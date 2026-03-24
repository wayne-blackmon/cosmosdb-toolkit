import * as assert from 'assert'
import * as fs from 'fs/promises'
import * as os from 'os'
import * as path from 'path'
import * as vscode from 'vscode'

async function getSignatureAtCursor(
    sourceWithCursor: string,
    language: 'javascript' | 'typescript' = 'typescript'
): Promise<vscode.SignatureHelp | undefined> {
    const cursorToken = '|'
    const cursorOffset = sourceWithCursor.indexOf(cursorToken)
    assert.ok(cursorOffset >= 0, 'Fixture must include cursor marker (|)')

    const content = sourceWithCursor.replace(cursorToken, '')

    const extension = language === 'typescript' ? 'ts' : 'js'
    const tempFilePath = path.join(
        os.tmpdir(),
        `.tmp-signature-test-${Date.now()}-${Math.random().toString(16).slice(2)}.${extension}`,
    )

    await fs.writeFile(tempFilePath, content, 'utf8')

    try {
        const doc = await vscode.workspace.openTextDocument(vscode.Uri.file(tempFilePath))
        await vscode.languages.setTextDocumentLanguage(doc, language)
        const position = doc.positionAt(cursorOffset)

        return await vscode.commands.executeCommand<vscode.SignatureHelp>(
            'vscode.executeSignatureHelpProvider',
            doc.uri,
            position,
        )
    } finally {
        await fs.unlink(tempFilePath).catch(() => undefined)
    }
}

suite('Scratchpad Signature Tests', () => {
    test('shows signature for getContext() in scratchpad-like code', async () => {
        const sig = await getSignatureAtCursor(
            'const ctx = getContext(|);',
            'typescript',
        )

        assert.ok(sig, 'Expected signature help for getContext(')
        assert.ok(sig!.signatures.length > 0, 'Expected at least one signature')
        assert.strictEqual(sig!.signatures[0].parameters.length, 0)
        assert.ok(sig!.signatures[0].label.startsWith('getContext('))
    })

    test('shows signature for ctx.getCollection() in scratchpad-like code', async () => {
        const sig = await getSignatureAtCursor(
            'const ctx = getContext();\nlet collection = ctx.getCollection(|);',
            'typescript',
        )

        assert.ok(sig, 'Expected signature help for getCollection(')
        assert.ok(sig!.signatures.length > 0, 'Expected at least one signature')
        assert.strictEqual(sig!.signatures[0].parameters.length, 0)
        assert.ok(sig!.signatures[0].label.startsWith('getCollection('))
    })

    test('shows signature for ctx.getRequest() in scratchpad-like code', async () => {
        const sig = await getSignatureAtCursor(
            'const ctx = getContext();\nctx.getRequest(|)',
            'typescript',
        )

        assert.ok(sig, 'Expected signature help for getRequest(')
        assert.ok(sig!.signatures.length > 0, 'Expected at least one signature')
        assert.strictEqual(sig!.signatures[0].parameters.length, 0)
        assert.ok(sig!.signatures[0].label.startsWith('getRequest('))
    })

    test('tracks active parameter index for queryDocuments()', async () => {
        const sig = await getSignatureAtCursor(
            'const ctx = getContext();\nconst collection = ctx.getCollection();\ncollection.queryDocuments(collection.getSelfLink(), \"SELECT * FROM c\", |)',
            'typescript',
        )

        assert.ok(sig, 'Expected signature help for queryDocuments(')
        assert.ok(sig!.signatures.length > 0, 'Expected at least one signature')
        assert.ok(sig!.signatures[0].label.startsWith('queryDocuments('))
        assert.strictEqual(sig!.activeParameter, 2)
        assert.ok(
            sig!.signatures[0].parameters.some(p => p.label.toString().includes('options')),
            'Expected options parameter in queryDocuments signature',
        )
    })
})
