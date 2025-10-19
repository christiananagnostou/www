import js from '@eslint/js'
import tsParser from '@typescript-eslint/parser'
import tsEslint from '@typescript-eslint/eslint-plugin'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import nextPlugin from '@next/eslint-plugin-next'
import prettier from 'eslint-plugin-prettier'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import vitest from '@vitest/eslint-plugin'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/** @type {Array<import('eslint').Linter.Config>} */
// @ts-expect-error - ESLint plugin types are incompatible with strict Config typing
export default [
  // Global ignores - applies to all configs
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'dist/**',
      'build/**',
      'coverage/**',
      '**/.turbo/**',
      'public/scripts/**',
      'eslint.config.*',
    ],
  },

  // Base JavaScript/JSX configuration
  js.configs.recommended,

  // Core React/Next.js/a11y configuration for all JS/TS files
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        // Node globals for config files
        process: 'readonly',
        __dirname: 'readonly',
        module: 'readonly',
        require: 'readonly',
      },
    },

    settings: {
      react: { version: 'detect' },
      'import/resolver': { node: { extensions: ['.js', '.jsx', '.ts', '.tsx'] } },
    },

    plugins: {
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      '@next/next': nextPlugin,
      prettier,
    },

    rules: {
      // Extend recommended configs
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,

      // Prettier integration
      'prettier/prettier': 'error',

      // React overrides and enhancements
      'react/react-in-jsx-scope': 'off', // Not needed with new JSX transform
      'react/prop-types': 'off', // Using TypeScript for prop validation
      'react/display-name': 'error',
      'react/jsx-key': ['error', { checkFragmentShorthand: true }],
      'react/jsx-no-leaked-render': 'error',
      'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
      'react/self-closing-comp': ['error', { component: true, html: true }],
      'react/jsx-sort-props': ['error', { callbacksLast: true, reservedFirst: true }],
      'react/jsx-boolean-value': ['error', 'never'],
      'react/jsx-fragments': ['error', 'syntax'],

      // React Hooks - strict enforcement
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',

      // Accessibility - keep strict
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/anchor-is-valid': 'error',
      'jsx-a11y/click-events-have-key-events': 'error',
      'jsx-a11y/no-static-element-interactions': 'error',

      // Code quality rules
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-template': 'error',
      'no-nested-ternary': 'error',
      'no-unneeded-ternary': 'error',
      'prefer-destructuring': ['error', { array: false, object: true }],
      'sort-imports': ['error', { ignoreDeclarationSort: true }],

      // Disable problematic base rules that TS handles better
      'no-unused-vars': 'off',
      'no-undef': 'off',
    },
  },

  // TypeScript-specific configuration with typed linting
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname,
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      '@typescript-eslint': tsEslint,
    },
    rules: {
      // Extend TypeScript recommended rules
      ...tsEslint.configs.recommended.rules,

      // Custom TypeScript rules matching your original config
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],

      // Disable base rules handled by TypeScript
      'no-unused-vars': 'off',
      'no-undef': 'off',

      // Keep your original approach to these rules (disabled for now)
      '@typescript-eslint/no-explicit-any': 'off', // You had this commented out
      '@typescript-eslint/prefer-nullish-coalescing': 'off', // You had this commented out
      '@typescript-eslint/triple-slash-reference': 'off', // Allow for next-env.d.ts

      // Optional: Enable these when ready for stricter checking
      // '@typescript-eslint/no-explicit-any': 'error',
      // '@typescript-eslint/prefer-nullish-coalescing': 'warn',
    },
  },

  // Test files configuration
  ...(vitest
    ? [
        {
          files: ['**/*.{spec,test}.{js,jsx,ts,tsx}'],
          plugins: {
            vitest,
          },
          languageOptions: {
            globals: vitest.environments?.env?.globals ?? {},
          },
          rules: {
            // Relax rules for test files
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-non-null-assertion': 'off',
            'react/display-name': 'off',
          },
        },
      ]
    : []),

  // Next.js pages directory overrides
  {
    files: ['pages/**/*.{js,jsx,ts,tsx}'],
    rules: {
      'react/display-name': 'off', // Pages don't need display names
    },
  },

  // Configuration files (next.config.js, etc.)
  {
    files: ['*.config.{js,mjs,ts}', '*.config.*.{js,mjs,ts}'],
    languageOptions: {
      globals: {
        module: 'readonly',
        require: 'readonly',
        __dirname: 'readonly',
        process: 'readonly',
      },
    },
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
      'no-console': 'off',
    },
  },
]
