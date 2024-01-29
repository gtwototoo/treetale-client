module.exports = {
	root: true,
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:svelte/recommended',
		'plugin:perfectionist/recommended-natural',
		'prettier'
	],
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint'],
	overrides: [
		{
			files: ['*.svelte'],
			parser: 'svelte-eslint-parser',
			parserOptions: {
				parser: '@typescript-eslint/parser'
			}
		}
	],
	env: {
		browser: true,
		es2017: true,
		node: true
	},
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020,
		extraFileExtensions: ['.svelte']
	},
	rules: {
		'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '_' }],
		'svelte/no-at-html-tags': 'off',
		'@typescript-eslint/adjacent-overload-signatures': 'off',
		'no-undef': 'off',
		'perfectionist/sort-svelte-attributes': 'off',
		'perfectionist/sort-imports': [
			'error',
			{
				type: 'natural',
				order: 'asc',
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
				'custom-groups': {
					value: {
						svelte: ['@sveltejs/kit', 'svelte/*', 'svelte']
					},
					type: {
						svelte: ['@sveltejs/kit', 'svelte/*', 'svelte']
					}
				},
				'newlines-between': 'always',
				'internal-pattern': ['$lib/**', '$page/**', '$UI']
			}
		]
	},
	ignorePatterns: ['*.cjs']
};
