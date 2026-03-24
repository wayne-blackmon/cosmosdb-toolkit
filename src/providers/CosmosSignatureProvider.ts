// src/providers/CosmosSignatureProvider.ts

import * as vscode from 'vscode'
import { cosmosApi } from './metadata/cosmosApi'
import { ApiFunction, ApiSignature } from './metadata/metadataSchema'
// ---------------------------------------------------------------------------
// Function‑name extraction regexes (string + compiled RegExp)
// ---------------------------------------------------------------------------

// Cursor AFTER "(" → e.g. "createDocument(" or "createDocument ("
const FN_AFTER_PAREN_STRING = '([A-Za-z_$][\\w$]*)\\s*\\($'
const FN_AFTER_PAREN_REGEX = new RegExp(FN_AFTER_PAREN_STRING)

// Cursor BEFORE "(" → e.g. "createDocument" or "createDocument   ("
const FN_BEFORE_PAREN_STRING = '([A-Za-z_$][\\w$]*)\\s*(?=\\()'
const FN_BEFORE_PAREN_REGEX = new RegExp(FN_BEFORE_PAREN_STRING)

export class CosmosSignatureProvider implements vscode.SignatureHelpProvider {
  provideSignatureHelp(
    document: vscode.TextDocument,
    position: vscode.Position,
  ): vscode.ProviderResult<vscode.SignatureHelp> {
    const line = document.lineAt(position).text
    const prefix = line.substring(0, position.character)

    const fn = this.resolveFunction(prefix)
    if (!fn) {
      return null
    }

    const signatureHelp = new vscode.SignatureHelp()

    // Build all overloads
    signatureHelp.signatures = fn.signatures.map((sig) => this.buildSignatureInformation(fn, sig))

    signatureHelp.activeSignature = 0
    signatureHelp.activeParameter = this.getActiveParameter(prefix)

    return signatureHelp
  }

  private resolveFunction(prefix: string): ApiFunction | null {
    const invokedFunction = this.getInvokedFunctionName(prefix)
    if (!invokedFunction) {
      return null
    }

    const groups = [cosmosApi.context, cosmosApi.collection, cosmosApi.request, cosmosApi.response]

    for (const group of groups) {
      for (const fn of group.functions) {
        if (fn.label === invokedFunction) {
          return fn
        }
      }
    }

    return null
  }

  private getInvokedFunctionName(prefix: string): string | null {
    // Case 1: cursor is after "("
    const after = FN_AFTER_PAREN_REGEX.exec(prefix)
    if (after?.[1]) {
      return after[1]
    }

    // Case 2: cursor is before "("
    const before = FN_BEFORE_PAREN_REGEX.exec(prefix)
    if (before?.[1]) {
      return before[1]
    }

    return null
  }

  private buildSignatureInformation(
    fn: ApiFunction,
    sig: ApiSignature,
  ): vscode.SignatureInformation {
    const label = `${fn.label}(${sig.parameters
      .map((p) => `${p.name}${p.optional ? '?' : ''}: ${p.type}`)
      .join(', ')})`

    const signatureInfo = new vscode.SignatureInformation(
      label,
      new vscode.MarkdownString(fn.documentation),
    )

    signatureInfo.parameters = sig.parameters.map(
      (p) => new vscode.ParameterInformation(`${p.name}: ${p.type}`, p.documentation ?? ''),
    )

    return signatureInfo
  }

  private getActiveParameter(prefix: string): number {
    const openParenIndex = prefix.lastIndexOf('(')
    if (openParenIndex === -1) {
      return 0
    }

    const args = prefix.substring(openParenIndex + 1)
    return args.split(',').length - 1
  }
}
