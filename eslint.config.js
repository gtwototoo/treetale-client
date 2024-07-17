import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import perfectionistNatural from 'eslint-plugin-perfectionist/configs/recommended-natural';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import ts from 'typescript-eslint';

export default [
	perfectionistNatural,
	prettier,
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs['flat/recommended'],
	...svelte.configs['flat/prettier'],
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parserOptions: {
				parser: ts.parser
			}
		}
	},
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
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
					'internal-pattern': ['$lib/**', '$page/**'],
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
		ignores: [
			'**/*.cjs',
			'**/.DS_Store',
			'**/node_modules',
			'**/build',
			'**/.svelte-kit',
			'**/pnpm-lock.yaml'
		]
	}
];
