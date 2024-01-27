module.exports = {
	root: true,
	extends: [
		'eslint:recommended',
		'plugin:svelte/recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:perfectionist/recommended-alphabetical',
		'prettier'
	],
	plugins: ['@typescript-eslint', 'perfectionist'],
	rules: {
		'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '_' }],
		'svelte/no-at-html-tags': 'off',
		'@typescript-eslint/adjacent-overload-signatures': 'off',
		'no-undef': 'off',
		'perfectionist/sort-imports': [
			'error',
			{
				type: 'alphabetical',
				order: 'asc',
				groups: [
					'type',
					'svelte',
					'aliases',
					['builtin', 'external'],
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
	parser: '@typescript-eslint/parser',
	ignorePatterns: ['*.cjs'],
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: 'module',
		extraFileExtensions: ['.svelte']
	},
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
	}
};
