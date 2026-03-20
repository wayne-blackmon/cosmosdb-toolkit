import * as assert from 'assert'
import ts from 'typescript'
import path from 'path'
import { cosmosApi } from '../../providers/metadata/cosmosApi.js'

suite('Cosmos Metadata Validation', () => {
  test('Metadata matches Cosmos SDK server-side interfaces', () => {
    const sdkFiles = [
      'Context.d.ts',
      'Collection.d.ts',
      'Request.d.ts',
      'Response.d.ts'
    ].map(f =>
      path.resolve(
        'node_modules/@azure/cosmos/dist-esm/src/client',
        f
      )
    )

    const program = ts.createProgram(sdkFiles, {
      strict: true,
      target: ts.ScriptTarget.ES2020,
      moduleResolution: ts.ModuleResolutionKind.NodeJs
    })

    const checker = program.getTypeChecker()
    const TARGETS = ['IContext', 'ICollection', 'IRequest', 'IResponse']

    let failures: string[] = []
    let suggestions: string[] = []

    for (const file of program.getSourceFiles()) {
      if (!file.fileName.endsWith('.d.ts')) continue

      ts.forEachChild(file, node => {
        if (!ts.isInterfaceDeclaration(node)) return
        if (!TARGETS.includes(node.name.text)) return

        const ifaceName = node.name.text
        const groupName = ifaceName.replace('I', '').toLowerCase() as keyof typeof cosmosApi
        const group = cosmosApi[groupName]

        if (!group) {
          failures.push(`Missing metadata group for ${ifaceName}`)
          suggestions.push(
            `Suggestion: Add metadata group "${groupName}" to cosmosApi.`
          )
          return
        }

        const sdkMethods = node.members.filter(ts.isMethodSignature)

        for (const m of sdkMethods) {
          const name = m.name.getText()
          const metaFn = group.functions.find((f: { label: string }) => f.label === name)

          const sdkParams = m.parameters.map((p: ts.ParameterDeclaration) =>
            checker.typeToString(checker.getTypeAtLocation(p))
          )

          if (!metaFn) {
            failures.push(`${ifaceName}.${name} missing in metadata`)
            suggestions.push(
              `Suggestion: Add function "${name}" to ${groupName}.functions with signature (${sdkParams.join(', ')}).`
            )
            continue
          }

          const metaParams = metaFn.signatures[0].parameters.map((p: { type: string }) => p.type)

          if (JSON.stringify(sdkParams) !== JSON.stringify(metaParams)) {
            failures.push(`${ifaceName}.${name} signature mismatch`)
            suggestions.push(
              `Suggestion: Update "${name}" signature in ${groupName}.functions\n` +
              `  metadata: (${metaParams.join(', ')})\n` +
              `  sdk:      (${sdkParams.join(', ')})`
            )
          }
        }
      })
    }

    if (failures.length > 0) {
      console.error('\n=== Metadata Drift Detected ===')
      console.error(failures.join('\n'))

      console.error('\n=== Suggested Fixes ===')
      console.error(suggestions.join('\n'))

      assert.fail('Metadata validation failed. See suggestions above.')
    }
  })
})
