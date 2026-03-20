// eslint.config.mjs

import tseslint from '@typescript-eslint/eslint-plugin'
import parser from '@typescript-eslint/parser'

export default [

  // Ignore VS Code test harness and build output
  {
    ignores: [
      '.vscode-test/**',
      'out/**',
      'node_modules/**'
    ]
  },

  // TypeScript rules
  {
    files: ['**/*.ts'],

    languageOptions: {
      parser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname
      }
    },

    plugins: {
      '@typescript-eslint': tseslint
    },

    rules: {
      quotes: ['error', 'single'],
      semi: ['error', 'never'],
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'off'
    }
  }
]
