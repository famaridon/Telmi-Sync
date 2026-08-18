import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

// Same shape react-scripts used to apply. Unused function parameters are
// deliberate all over this codebase: positional callback arguments, and the
// no-op stubs that document the shape of each createContext default.
const shared = {
  'no-unused-vars': ['warn', {
    args: 'none',
    caughtErrors: 'none',
    ignoreRestSiblings: true
  }],
  // `catch (ignored) {}` is used deliberately to fall through to the next
  // candidate rather than to swallow an unexpected failure.
  'no-empty': ['error', {allowEmptyCatch: true}]
}

export default [
  {
    ignores: ['build/**', 'electron/dist/**', 'extraResources/**']
  },

  // Renderer. Runs inside the BrowserWindow, which is created with
  // `nodeIntegration: true`, so node globals are reachable there too. JSX
  // lives in .js files, hence the parser option rather than a .jsx glob.
  //
  // eslint-plugin-react is deliberately absent: core no-unused-vars already
  // counts JSX references as uses, so the plugin would only add a stale
  // minimatch and eight audit advisories.
  {
    files: ['src/**/*.js'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {...globals.browser, ...globals.node},
      parserOptions: {ecmaFeatures: {jsx: true}}
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh
    },
    rules: {
      ...js.configs.recommended.rules,
      ...shared,
      // The two rules react-scripts used to provide. The rest of
      // react-hooks' recommended set targets the React Compiler and does not
      // fit a codebase written before it.
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': ['warn', {allowConstantExport: true}]
    }
  },

  // Electron main process and build tooling: node only, no DOM, no JSX.
  {
    files: ['public/**/*.js', 'vite.config.js', 'eslint.config.js'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: globals.node
    },
    rules: {
      ...js.configs.recommended.rules,
      ...shared
    }
  }
]
