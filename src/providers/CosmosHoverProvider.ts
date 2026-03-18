import * as vscode from 'vscode'
import { ApiFunction, ApiSignature, cosmosApi } from './metadata/cosmosApi'

export class CosmosHoverProvider implements vscode.HoverProvider {
  provideHover(document: vscode.TextDocument, position: vscode.Position) {
    const range = document.getWordRangeAtPosition(position)
    if (!range) return

    const word = document.getText(range)

    const apiEntry = this.findApiFunction(word)
    if (!apiEntry) return

    const md = new vscode.MarkdownString()
    md.isTrusted = true

    md.appendMarkdown(`### ${apiEntry.label}\n\n`)
    md.appendMarkdown(`${apiEntry.documentation}\n\n`)

    apiEntry.signatures.forEach((sig: ApiSignature) => {
      md.appendMarkdown('**Signature**\n\n')
      const params = sig.parameters
        .map(p => `${p.name}${p.optional ? '?' : ''}: ${p.type}`)
        .join(', ')
      md.appendCodeblock(`(${params}) => ${sig.returns}`, 'typescript')
    })

    return new vscode.Hover(md, range)
  }

  findApiFunction(name: string) {
    const groups = Object.values(cosmosApi)
    for (const group of groups) {
      const fn = group.functions.find((f: ApiFunction) => f.label === name)
      if (fn) return fn
    }
    return undefined
  }
}
