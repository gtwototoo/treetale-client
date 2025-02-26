import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import ts from 'typescript-eslint';

import svelteConfig from './svelte.config.js';

export default [
	prettier,
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs.recommended,
	importPlugin.flatConfigs['warnings'],
	importPlugin.flatConfigs['typescript'],
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			},
			parserOptions: {
				projectService: true,
				extraFileExtensions: ['.svelte'],
				parser: ts.parser,
				svelteConfig
			}
		}
	},
	{
		settings: {
			'import/core-modules': ['svelte', '$app', '$env', '@sveltejs/kit']
		},
		rules: {
			'import/order': [
				'warn',
				{
					alphabetize: {
						order: 'asc',
						caseInsensitive: true
					},
					pathGroups: [
						{
							pattern: '$lib/**',
							group: 'parent',
							position: 'before'
						},
						{
							pattern: '$board/**',
							group: 'parent',
							position: 'before'
						}
					],
					'newlines-between': 'always'
				}
			]
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
