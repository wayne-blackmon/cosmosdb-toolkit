// src/test/metadata/snippetValidator.test.ts

import * as assert from 'assert'
import { cosmosApi } from '../../providers/metadata/cosmosApi'
import { ApiGroup } from '../../providers/metadata/metadataSchema'

function hasTypeScriptOnlySyntax(line: string): boolean {
    const hasTypedVariableDeclaration = /\b(?:const|let|var)\s+[A-Za-z_$][A-Za-z0-9_$]*\s*:\s*[^=;]+(?:=|;|$)/.test(line)
    const hasTypedFunctionParameter = /(?:\bfunction\b[^()]*\([^)]*\b[A-Za-z_$][A-Za-z0-9_$]*\s*:\s*[^,)]+)|(?:\([^)]*\b[A-Za-z_$][A-Za-z0-9_$]*\s*:\s*[^,)]+\)\s*=>)/.test(line)
    const hasTypedFunctionReturn = /\)\s*:\s*[A-Za-z_$][A-Za-z0-9_$<>,\s\[\]\|&]*\s*(?:=>|\{|$)/.test(line)
    const hasTypeAssertion = /\bas\s+[A-Za-z_$][A-Za-z0-9_$<>,\s\[\]\|&]*/.test(line)
    const hasGenericTypeUsage = /\b[A-Za-z_$][A-Za-z0-9_$]*\s*<[^>]+>/.test(line)
    const hasTypeDeclaration = /^\s*(?:interface|type)\s+[A-Za-z_$][A-Za-z0-9_$]*/.test(line)

    return (
        hasTypedVariableDeclaration ||
        hasTypedFunctionParameter ||
        hasTypedFunctionReturn ||
        hasTypeAssertion ||
        hasGenericTypeUsage ||
        hasTypeDeclaration
    )
}

function hasImplicitAnyFunctionSignature(line: string): boolean {
    const namedOrAnonymousFunction = /function(?:\s+[A-Za-z_$][A-Za-z0-9_$]*)?\(([^)]*)\)/.exec(line)
    if (namedOrAnonymousFunction) {
        const params = namedOrAnonymousFunction[1].trim()
        if (params.length > 0 && !params.includes(':')) {
            return true
        }
    }

    const arrowWithParens = /\(([^)]*)\)\s*=>/.exec(line)
    if (arrowWithParens) {
        const params = arrowWithParens[1].trim()
        if (params.length > 0 && !params.includes(':')) {
            return true
        }
    }

    const singleParamArrow = /^\s*[A-Za-z_$][A-Za-z0-9_$]*\s*=>/.test(line)
    if (singleParamArrow) {
        return true
    }

    return false
}

suite('Cosmos Snippet Validation', () => {
    test('All functions have valid JS + TS snippet variants', () => {
        const groups: ApiGroup[] = [
            cosmosApi.context,
            cosmosApi.collection,
            cosmosApi.request,
            cosmosApi.response
        ]

        const failures: string[] = []

        for (const group of groups) {
            for (const fn of group.functions) {
                const label = `${group.label}.${fn.label}`

                if (!fn.snippet) {
                    failures.push(`${label} missing snippet block`)
                    continue
                }

                // Validate JS variant
                validateSnippetVariant(
                    fn.snippet.js,
                    `${label}.snippet.js`,
                    failures,
                    { allowTypescript: false }
                )

                // Validate TS variant
                validateSnippetVariant(
                    fn.snippet.ts,
                    `${label}.snippet.ts`,
                    failures,
                    { allowTypescript: true }
                )
            }
        }

        if (failures.length > 0) {
            console.error('\n=== Snippet Validation Failures ===')
            failures.forEach(f => console.error(f))
            assert.fail(`Snippet validation failed:\n${failures.join('\n')}`)
        }
    })
})

function validateSnippetVariant(
    variant: any,
    label: string,
    failures: string[],
    opts: { allowTypescript: boolean }
): void {
    if (!variant) {
        failures.push(`${label} missing`)
        return
    }

    if (!variant.prefix || typeof variant.prefix !== 'string') {
        failures.push(`${label} missing prefix`)
    }

    if (!variant.description || typeof variant.description !== 'string') {
        failures.push(`${label} missing description`)
    }

    if (!Array.isArray(variant.body)) {
        failures.push(`${label} body must be an array`)
        return
    }

    if (variant.body.length === 0) {
        failures.push(`${label} body is empty`)
    }

    for (const line of variant.body) {
        if (typeof line !== 'string') {
            failures.push(`${label} body contains non-string line`)
            continue
        }

        // JS variant must NOT contain TypeScript syntax
        if (!opts.allowTypescript) {
            if (hasTypeScriptOnlySyntax(line)) {
                failures.push(`${label} contains TypeScript syntax: "${line}"`)
            }
        }

        // TS variant must NOT contain untyped function signatures
        if (opts.allowTypescript) {
            if (hasImplicitAnyFunctionSignature(line)) {
                failures.push(`${label} contains implicit-any pattern: "${line}"`)
            }
        }
    }
}
