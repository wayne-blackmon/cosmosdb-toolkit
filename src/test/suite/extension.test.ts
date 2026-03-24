// src/test/suite/extension.test.ts

import * as assert from 'assert'
import * as vscode from 'vscode'

suite('Extension Activation Tests', () => {
  test('extension loads and activates', async () => {
    const extension = vscode.extensions.getExtension('wayne-blackmon.cosmosdb-toolkit')

    assert.ok(extension, 'Extension should be found')

    await extension?.activate()

    assert.ok(extension?.isActive, 'Extension should be active after activation')
  })

  test('scratchpad command is registered', async () => {
    const commands = await vscode.commands.getCommands(true)

    assert.ok(
      commands.includes('cosmosdb-toolkit.openScratchpad'),
      'openScratchpad command should be registered',
    )
  })
})
