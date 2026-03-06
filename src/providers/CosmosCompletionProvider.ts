// src/providers/CosmosCompletionProvider.ts

import * as vscode from 'vscode'
import { cosmosApi, ApiFunction } from './metadata/cosmosApi'

export class CosmosCompletionProvider implements vscode.CompletionItemProvider {
  provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
  ): vscode.ProviderResult<vscode.CompletionItem[]> {
    const line = document.lineAt(position).text
    const prefix = line.substring(0, position.character).trim()

    // Context API
    if (prefix.endsWith('getContext().')) {
      return this.buildItems(cosmosApi.context.functions)
    }

    // Collection API
    if (prefix.endsWith('getCollection().') || prefix.endsWith('collection.')) {
      return this.buildItems(cosmosApi.collection.functions)
    }

    // Request API
    if (prefix.endsWith('getRequest().') || prefix.endsWith('request.')) {
      return this.buildItems(cosmosApi.request.functions)
    }

    // Response API
    if (prefix.endsWith('getResponse().') || prefix.endsWith('response.')) {
      return this.buildItems(cosmosApi.response.functions)
    }

    // Default: top-level context API
    return this.buildItems(cosmosApi.context.functions)
  }

  private buildItems(funcs: ApiFunction[]): vscode.CompletionItem[] {
    return funcs.map((fn) => {
      const item = new vscode.CompletionItem(
        fn.label,
        vscode.CompletionItemKind.Function,
      )

      item.detail = fn.detail
      item.documentation = new vscode.MarkdownString(fn.documentation)

      item.sortText = '0000'
      item.preselect = true
      item.commitCharacters = ['(']

      return item
    })
  }
}
