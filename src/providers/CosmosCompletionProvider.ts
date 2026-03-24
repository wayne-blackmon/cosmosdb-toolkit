// src/providers/CosmosCompletionProvider.ts

import * as vscode from 'vscode'
import { cosmosApi } from './metadata/cosmosApi'
import { sprocSnippets } from '../snippets/sprocs'

export class CosmosCompletionProvider implements vscode.CompletionItemProvider {
  provideCompletionItems(
    document: vscode.TextDocument,
    _position: vscode.Position
  ): vscode.ProviderResult<vscode.CompletionItem[]> {
    const isTS = document.languageId === 'typescript'
    const line = document.lineAt(_position.line).text
    const beforeCursor = line.substring(0, _position.character)
    const prefix = beforeCursor.split(/[^A-Za-z0-9_.]/).pop() ?? ''

    const items: vscode.CompletionItem[] = []

    const isCollectionContext = /(?:\bcollection\b|getCollection\(\))\s*\.$/i.test(beforeCursor)
    const isContextContext = /(?:\bcontext\b|getContext\(\))\s*\.$/i.test(beforeCursor)
    const isRequestContext = /(?:\brequest\b|getRequest\(\))\s*\.$/i.test(beforeCursor)
    const isResponseContext = /(?:\bresponse\b|getResponse\(\))\s*\.$/i.test(beforeCursor)
    const isFunctionNameContext = /[A-Za-z_][A-Za-z0-9_]*$/.test(beforeCursor)
    const isBlankLineContext = prefix.length === 0 && /^\s*$/.test(beforeCursor)
    const isSprocPrefixContext = prefix.length > 0 && prefix.endsWith('.')
    const isDotContext =
      isCollectionContext ||
      isContextContext ||
      isRequestContext ||
      isResponseContext

    if (!isDotContext && !isFunctionNameContext && !isBlankLineContext && !isSprocPrefixContext) {
      return []
    }

    const tokenMatch = /[A-Za-z_][A-Za-z0-9_]*$/.exec(beforeCursor)
    const tokenLength = tokenMatch?.[0]?.length ?? 0
    const replacementLength = prefix.length > 0 ? prefix.length : tokenLength
    const replaceStartChar = Math.max(0, _position.character - replacementLength)
    const replaceStart = new vscode.Position(_position.line, replaceStartChar)
    const replaceRange = new vscode.Range(replaceStart, _position)
    const prefixRange = replaceRange

    for (const group of Object.values(cosmosApi)) {
      for (const fn of group.functions) {
        const hasSnippet = !!fn.snippet
        const contextMatch =
          (isCollectionContext && group.label === 'ICollection') ||
          (isContextContext && group.label === 'IContext') ||
          (isRequestContext && group.label === 'IRequest') ||
          (isResponseContext && group.label === 'IResponse')

        if (contextMatch && hasSnippet) {
          const variant = isTS ? fn.snippet!.ts : fn.snippet!.js
          const item = new vscode.CompletionItem(fn.label, vscode.CompletionItemKind.Snippet)
          item.insertText = new vscode.SnippetString(variant.body.join('\n'))
          item.detail = variant.description ?? fn.detail ?? fn.label
          item.preselect = true
          item.sortText = '0000'
          item.filterText = fn.label
          item.range = replaceRange
          item.commitCharacters = ['\t']
          items.push(item)
          continue
        }

        if (isFunctionNameContext && hasSnippet) {
          if (!fn.label.toLowerCase().startsWith(prefix.toLowerCase())) {
            continue
          }

          const variant = isTS ? fn.snippet!.ts : fn.snippet!.js
          const item = new vscode.CompletionItem(fn.label, vscode.CompletionItemKind.Snippet)
          item.insertText = new vscode.SnippetString(variant.body.join('\n'))
          item.detail = variant.description ?? fn.detail ?? fn.label
          item.preselect = true
          item.sortText = '0001'
          item.filterText = fn.label
          item.range = replaceRange
          item.commitCharacters = ['\t']
          items.push(item)
          continue
        }

        if (
          prefix.length > 0 &&
          !fn.label.toLowerCase().startsWith(prefix.toLowerCase())
        ) {
          continue
        }

        const item = new vscode.CompletionItem(fn.label, vscode.CompletionItemKind.Function)
        item.detail = fn.detail
        item.documentation = fn.documentation
        item.sortText = '9999'
        item.range = replaceRange
        items.push(item)
      }
    }

    for (const snip of sprocSnippets) {
      const pfx = prefix.toLowerCase()
      const normalizedPrefixRaw = pfx.startsWith('cosmos.') ? pfx.slice('cosmos.'.length) : pfx
      const normalizedSnippetPrefix = snip.prefix.toLowerCase().startsWith('cosmos.')
        ? snip.prefix.toLowerCase().slice('cosmos.'.length)
        : snip.prefix.toLowerCase()
      const normalizedSegments = normalizedSnippetPrefix.split('.')
      const normalizedPrefix = normalizedPrefixRaw.replace(/\.+$/, '')
      const showOnBlankLine = pfx.length === 0 && /^\s*$/.test(beforeCursor)

      const matchesPrefix =
        showOnBlankLine ||
        snip.prefix.toLowerCase().startsWith(pfx) ||
        (normalizedPrefix.length > 0 && (
          normalizedSnippetPrefix.startsWith(normalizedPrefix) ||
          normalizedSegments.some(segment => segment.startsWith(normalizedPrefix))
        ))

      if (!matchesPrefix) continue

      const item = new vscode.CompletionItem(snip.prefix, vscode.CompletionItemKind.Snippet)
      item.insertText = new vscode.SnippetString(snip.body.join('\n'))
      item.detail = snip.description
      item.preselect = true
      item.sortText = '0000'
      item.filterText = snip.prefix
      item.range = prefixRange
      item.commitCharacters = ['\t']
      items.push(item)
    }

    return items
  }
}
