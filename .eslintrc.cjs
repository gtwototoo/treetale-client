module.exports = {
	root: true,
	extends: [
		'eslint:recommended',
		'plugin:svelte/recommended',
		'plugin:@typescript-eslint/recommended',
		'prettier'
	],
	plugins: ['perfectionist'],
	rules: {
		'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '_' }],
		'perfectionist/sort-interfaces': 'error',
		'svelte/no-at-html-tags': 'off',
		'@typescript-eslint/adjacent-overload-signatures': 'off'
	},
	parser: '@typescript-eslint/parser',
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
