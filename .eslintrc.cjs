module.exports = {
	root: true,
	extends: [
		'plugin:svelte/recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:perfectionist/recommended-natural',
		'prettier'
	],
	parser: '@typescript-eslint/parser',
	overrides: [
		{
			files: ['*.svelte'],
			parser: 'svelte-eslint-parser',
			parserOptions: {
				parser: '@typescript-eslint/parser'
			}
		}
	],
	rules: {
		'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '_' }],
		'svelte/sort-attributes': 'off',
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
