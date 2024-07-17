import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import parser from 'svelte-eslint-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	allConfig: js.configs.all,
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended
});

export default [
	{
		ignores: [
			'**/*.cjs',
			'**/.DS_Store',
			'**/node_modules',
			'**/build',
			'**/.svelte-kit',
			'**/pnpm-lock.yaml'
		]
	},
	...compat.extends(
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:svelte/recommended',
		'plugin:perfectionist/recommended-natural',
		'prettier'
	),
	{
		languageOptions: {
			ecmaVersion: 2020,

			globals: {
				...globals.browser,
				...globals.node
			},
			parser: tsParser,
			parserOptions: {
				extraFileExtensions: ['.svelte']
			},

			sourceType: 'module'
		},

		plugins: {
			'@typescript-eslint': typescriptEslint
		},

		rules: {
			'@typescript-eslint/adjacent-overload-signatures': 'off',

			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					argsIgnorePattern: '_'
				}
			],
			'no-undef': 'off',
			'perfectionist/sort-imports': [
				'error',
				{
					'custom-groups': {
						type: {
							svelte: ['@sveltejs/kit', 'svelte/*', 'svelte']
						},

						value: {
							svelte: ['@sveltejs/kit', 'svelte/*', 'svelte']
						}
					},
					groups: [
						'type',
						'svelte',
						['builtin', 'external'],
						'aliases',
						'internal-type',
						'internal',
						['parent-type', 'sibling-type', 'index-type'],
						['parent', 'sibling', 'index'],
						'side-effect',
						'style',
						'object',
						'unknown'
					],

					'internal-pattern': ['$lib/**', '$page/**', '$UI'],

					'newlines-between': 'always',

					order: 'asc',
					type: 'natural'
				}
			],
			'perfectionist/sort-svelte-attributes': 'off',

			'svelte/no-at-html-tags': 'off'
		}
	},
	{
		files: ['**/*.svelte'],

		languageOptions: {
			ecmaVersion: 5,
			parser: parser,
			parserOptions: {
				parser: '@typescript-eslint/parser'
			},

			sourceType: 'script'
		}
	}
];
