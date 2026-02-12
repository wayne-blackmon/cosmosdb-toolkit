import * as vscode from 'vscode';
import { cosmosApi } from './metadata/cosmosApi';

export class CosmosCompletionProvider implements vscode.CompletionItemProvider {
  provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
  ): vscode.ProviderResult<vscode.CompletionItem[]> {
    const line = document.lineAt(position).text;
    const prefix = line.substring(0, position.character).trim();

    // Context API surface
    if (prefix.endsWith('getContext().')) {
      return this.buildItems(cosmosApi.context.functions);
    }

    // Collection API surface
    if (prefix.endsWith('getCollection().') || prefix.endsWith('collection.')) {
      return this.buildItems(cosmosApi.collection.functions);
    }

    // Response API surface
    if (prefix.endsWith('getResponse().') || prefix.endsWith('response.')) {
      return this.buildItems(cosmosApi.response.functions);
    }

    // Top-level suggestions (context API)
    return this.buildItems(cosmosApi.context.functions);
  }

  private buildItems(funcs: any[]): vscode.CompletionItem[] {
    return funcs.map((fn) => {
      const item = new vscode.CompletionItem(
        fn.label,
        vscode.CompletionItemKind.Function,
      );

      item.detail = fn.detail;
      item.documentation = new vscode.MarkdownString(fn.documentation);

      // Ranking + filtering behavior
      item.sortText = '0000';
      item.preselect = true;
      item.filterText = fn.label;
      item.commitCharacters = ['('];

      return item;
    });
  }
}
