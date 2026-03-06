// eslint.config.mjs

import tseslint from '@typescript-eslint/eslint-plugin'
import parser from '@typescript-eslint/parser'

export default [
  {
    ignores: ['.vscode-test/**']
  },

  {
    files: ['**/*.ts'],
    languageOptions: {
      parser
    },
    plugins: {
      '@typescript-eslint': tseslint
    },
    rules: {
      quotes: ['error', 'single'],
      semi: ['error', 'never']
    }
  }
]
