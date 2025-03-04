import { fileURLToPath, URL } from 'node:url';

import { includeIgnoreFile } from '@eslint/compat';
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import ts from 'typescript-eslint';

import svelteConfig from './svelte.config.js';

const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url));

export default ts.config(
	includeIgnoreFile(gitignorePath),
	js.configs.recommended,
	ts.configs.recommended,
	prettier,
	...svelte.configs.recommended,
	...svelte.configs['flat/prettier'],
	importPlugin.flatConfigs['warnings'],
	importPlugin.flatConfigs['typescript'],
	{
		settings: {
			'import/core-modules': ['svelte', '$app', '$env', '@sveltejs/kit'],
			'import/parsers': {
				'typescript-eslint/parser': ['.ts', '.tsx', '.cts', '.mts'],
				espree: ['.js', 'jsx', '.cjs', '.mjs']
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
			'svelte/no-at-html-tags': 'off',
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
		},
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		ignores: ['**/*.cjs', 'eslint.config.js', 'svelte.config.js'],
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
	}
);
