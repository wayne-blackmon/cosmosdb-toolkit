// src/test/suite/index.ts

import * as path from 'path'
import Mocha from 'mocha'
import { glob } from 'glob'

export function run(): Promise<void> {
  const mocha = new Mocha({
    ui: 'tdd',
    color: true,
  })

  const testsRoot = path.resolve(__dirname)

  console.log(`Running tests in: ${testsRoot}`)

  return new Promise((resolve, reject) => {
    glob('**/*.test.js', { cwd: testsRoot })
      .then((files: string[]) => {
        if (files.length === 0) {
          console.warn('⚠ No test files found.')
        }

        for (const file of files) {
          mocha.addFile(path.resolve(testsRoot, file))
        }

        try {
          mocha.run((failures: number) => {
            if (failures > 0) {
              reject(new Error(`${failures} tests failed.`))
            } else {
              resolve()
            }
          })
        } catch (err) {
          reject(err)
        }
      })
      .catch(reject)
  })
}
