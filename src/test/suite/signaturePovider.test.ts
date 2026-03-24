import * as assert from 'assert'
import * as fs from 'fs/promises'
import * as os from 'os'
import * as path from 'path'
import * as vscode from 'vscode'

async function getSignatureHelpAtCursor(
    sourceWithCursor: string,
    language: 'javascript' | 'typescript' = 'typescript'
): Promise<vscode.SignatureHelp | undefined> {
    const cursorToken = '|'
    const offset = sourceWithCursor.indexOf(cursorToken)
    assert.ok(offset >= 0, 'Fixture content must include a cursor marker (|)')

    const source = sourceWithCursor.replace(cursorToken, '')
    const extension = language === 'typescript' ? 'ts' : 'js'
    const tempFilePath = path.join(
        os.tmpdir(),
        `.tmp-signature-provider-${Date.now()}-${Math.random().toString(16).slice(2)}.${extension}`,
    )

    await fs.writeFile(tempFilePath, source, 'utf8')

    try {
        const doc = await vscode.workspace.openTextDocument(vscode.Uri.file(tempFilePath))
        await vscode.languages.setTextDocumentLanguage(doc, language)
        const position = doc.positionAt(offset)

        return await vscode.commands.executeCommand<vscode.SignatureHelp>(
            'vscode.executeSignatureHelpProvider',
            doc.uri,
            position,
        )
    } finally {
        await fs.unlink(tempFilePath).catch(() => undefined)
    }
}

suite('Signature Provider Tests', () => {
    test('signature help appears for getContext()', async () => {
        const sig = await getSignatureHelpAtCursor('const ctx = getContext(|);')

        assert.ok(sig, 'SignatureHelp should exist')
        assert.ok(sig!.signatures.length > 0, 'Should contain at least one signature')
        assert.ok(sig!.signatures[0].label.startsWith('getContext('))
        assert.strictEqual(sig!.signatures[0].parameters.length, 0)
    })

    test('signature help appears for createDocument()', async () => {
        const sig = await getSignatureHelpAtCursor(
            [
                'const collection = getContext().getCollection();',
                'collection.createDocument(collection.getSelfLink(), { id: "x" }, |);',
            ].join('\n'),
        )

        assert.ok(sig, 'SignatureHelp should exist')
        assert.ok(sig!.signatures.length > 0, 'Should contain at least one signature')
        assert.ok(sig!.signatures[0].parameters.length >= 3)
        assert.ok(sig!.signatures[0].label.startsWith('createDocument('))
        assert.strictEqual(sig!.activeParameter, 2)
    })

    test('active parameter index tracks commas for queryDocuments()', async () => {
        const sig = await getSignatureHelpAtCursor(
            [
                'const collection = getContext().getCollection();',
                'collection.queryDocuments(collection.getSelfLink(), "SELECT * FROM c", |);',
            ].join('\n'),
        )

        assert.ok(sig, 'SignatureHelp should exist')
        assert.ok(sig!.signatures.length > 0, 'Should contain at least one signature')
        assert.strictEqual(sig!.activeParameter, 2)
    })
})