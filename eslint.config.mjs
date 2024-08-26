import globals from 'globals'
import pluginJs from '@eslint/js'

export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: globals.browser
    },
    ...pluginJs.configs.recommended,
    rules: {
      'no-console': 'off',
      indent: ['error', 2],
      quotes: ['error', 'single']
    }
  }
]
