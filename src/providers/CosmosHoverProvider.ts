// src/providers/CosmosHoverProvider.ts

import * as vscode from 'vscode'
import { cosmosApi } from './metadata/cosmosApi'
import { ApiFunction, ApiGroup } from './metadata/metadataSchema'

export class CosmosHoverProvider implements vscode.HoverProvider {
  private cache = new Map<string, vscode.MarkdownString>()

  provideHover(
    document: vscode.TextDocument,
    position: vscode.Position
  ): vscode.ProviderResult<vscode.Hover> {
    const range = document.getWordRangeAtPosition(position)
    if (!range) return

    const word = document.getText(range)
    const apiFn = this.findFunctionByLabel(word)
    if (!apiFn) return

    // Parameter-level hover (TypeScript-style)
    const paramHover = this.tryParameterHover(apiFn, word)
    if (paramHover) return new vscode.Hover(paramHover, range)

    // Cached full hover
    const md = this.getCachedHover(apiFn.label, () =>
      this.buildHover(apiFn, document)
    )

    return new vscode.Hover(md, range)
  }

  private getCachedHover(
    key: string,
    builder: () => vscode.MarkdownString
  ): vscode.MarkdownString {
    if (this.cache.has(key)) return this.cache.get(key)!
    const md = builder()
    this.cache.set(key, md)
    return md
  }

  private findFunctionByLabel(label: string): ApiFunction | undefined {
    const groups: ApiGroup[] = [
      cosmosApi.context,
      cosmosApi.collection,
      cosmosApi.request,
      cosmosApi.response
    ]

    for (const group of groups) {
      const fn = group.functions.find(f => f.label === label)
      if (fn) return fn
    }

    return undefined
  }

  private tryParameterHover(
    fn: ApiFunction,
    word: string
  ): vscode.MarkdownString | null {
    const sig = fn.signatures[0]
    if (!sig) return null

    const param = sig.parameters.find(p => p.name === word)
    if (!param) return null

    const md = new vscode.MarkdownString()
    md.appendMarkdown(`\`${param.name}\`: \`${param.type}\`\n`)
    if (param.documentation) md.appendMarkdown(`${param.documentation}`)
    return md
  }

  private buildHover(
    fn: ApiFunction,
    document: vscode.TextDocument
  ): vscode.MarkdownString {
    const md = new vscode.MarkdownString()
    md.isTrusted = true

    this.renderHeader(md, fn)
    this.renderDescription(md, fn)
    this.renderSignature(md, fn)
    this.renderNotes(md, fn)
    this.renderRelated(md, fn)
    this.renderSnippet(md, fn, document)

    return md
  }

  private renderHeader(md: vscode.MarkdownString, fn: ApiFunction): void {
    md.appendMarkdown(`${fn.label}\n\n`)
  }

  private renderDescription(md: vscode.MarkdownString, fn: ApiFunction): void {
    if (fn.documentation) {
      md.appendMarkdown(`${fn.documentation}\n\n`)
    }
  }

  private renderSignature(md: vscode.MarkdownString, fn: ApiFunction): void {
    const sigs = fn.signatures
    if (!sigs?.length) return

    const primary = sigs[0]

    md.appendMarkdown('```ts\n')
    md.appendMarkdown(primary.label + '\n')
    md.appendMarkdown('```\n')

    if (sigs.length > 1) {
      md.appendMarkdown(`${sigs.length - 1} more overloads available\n\n`)
    } else {
      md.appendMarkdown('\n')
    }
  }

  private renderNotes(md: vscode.MarkdownString, fn: ApiFunction): void {
    if (!fn.notes?.length) return

    md.appendMarkdown(`Notes: ${fn.notes.join(' ')}\n\n`)
  }

  private renderRelated(md: vscode.MarkdownString, fn: ApiFunction): void {
    if (!fn.related?.length) return

    md.appendMarkdown(`Related: ${fn.related.map(r => `\`${r}\``).join(', ')}\n\n`)
  }

  private renderSnippet(
    md: vscode.MarkdownString,
    fn: ApiFunction,
    document: vscode.TextDocument
  ): void {
    if (!fn.snippet) return

    const isTS = document.languageId === 'typescript'
    const variant = isTS ? fn.snippet.ts : fn.snippet.js
    if (!variant?.body?.length) return

    const lang = isTS ? 'ts' : 'javascript'

    md.appendMarkdown('```' + lang + '\n')
    variant.body.forEach(line => md.appendMarkdown(`${line}\n`))
    md.appendMarkdown('```\n')
  }
}
