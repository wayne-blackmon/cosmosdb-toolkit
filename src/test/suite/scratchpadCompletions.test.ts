import * as assert from 'assert'
import * as vscode from 'vscode'

function getReplacementRange(item: vscode.CompletionItem): vscode.Range | undefined {
  if (!item.range) return undefined
  if (item.range instanceof vscode.Range) return item.range
  return item.range.replacing
}

async function getCompletionsAtLineEnd(
  content: string,
  language: 'javascript' | 'typescript'
): Promise<vscode.CompletionList> {
  const cursorToken = '|'
  const offset = content.indexOf(cursorToken)
  assert.ok(offset >= 0, 'Fixture content must include a cursor marker (|)')

  const source = content.replace(cursorToken, '')

  const doc = await vscode.workspace.openTextDocument({
    content: source,
    language,
  })

  const position = doc.positionAt(offset)

  const list = await vscode.commands.executeCommand<vscode.CompletionList>(
    'vscode.executeCompletionItemProvider',
    doc.uri,
    position,
  )

  assert.ok(list, 'Completion list should exist')
  return list!
}

suite('Scratchpad Completion Tests', () => {
  test('TS scratchpad fixture: cosmos. suggests cosmos.sproc snippets', async () => {
    const content = [
      'export function testSproc(input: any): void {',
      '  cosmos.|',
      '}',
    ].join('\n')

    const list = await getCompletionsAtLineEnd(content, 'typescript')
    const labels = list.items.map(i => i.label.toString())

    assert.ok(
      labels.some(l => l.startsWith('cosmos.sproc.')),
      'cosmos. should include cosmos.sproc.* snippet completions'
    )
  })

  test('TS scratchpad fixture: sproc. suggests cosmos.sproc snippets', async () => {
    const content = [
      'export function testSproc(input: any): void {',
      '  sproc.|',
      '}',
    ].join('\n')

    const list = await getCompletionsAtLineEnd(content, 'typescript')
    const labels = list.items.map(i => i.label.toString())

    assert.ok(
      labels.some(l => l.startsWith('cosmos.sproc.')),
      'sproc. should include cosmos.sproc.* snippet completions'
    )
  })

  test('TS scratchpad fixture: cosmos.sproc. replaces full dotted prefix', async () => {
    const content = [
      'export function testSproc(input: any): void {',
      '  cosmos.sproc.|',
      '}',
    ].join('\n')

    const list = await getCompletionsAtLineEnd(content, 'typescript')
    const item = list.items.find(i => i.label.toString() === 'cosmos.sproc.basic')

    assert.ok(item, 'Expected cosmos.sproc.basic completion item')

    const range = getReplacementRange(item!)
    assert.ok(range, 'Completion item should define a replacement range')
    assert.strictEqual(range!.start.character, 2, 'Range should start at the beginning of "cosmos.sproc."')
    assert.strictEqual(range!.end.character, 15, 'Range should end at the end of "cosmos.sproc."')
  })

  test('JS scratchpad fixture: typing sproc suggests stored procedure snippets', async () => {
    const content = [
      'function run() {',
      '  sproc|',
      '}',
    ].join('\n')

    const list = await getCompletionsAtLineEnd(content, 'javascript')
    const labels = list.items.map(i => i.label.toString())

    assert.ok(
      labels.some(l => l.startsWith('cosmos.sproc')),
      'sproc should include stored procedure snippet completions'
    )
  })
})
