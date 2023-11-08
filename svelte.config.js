import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/kit/vite';
import { preprocessor as documentPreprocessor } from '@sveltekit-addons/document';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [
		vitePreprocess(),
		documentPreprocessor(),
		preprocess({
			postcss: true
		})
	],

	kit: {
		adapter: adapter(),
		alias: {
			$UI: 'src/lib/UI'
		}
	},

	vitePlugin: {
		inspector: {
			holdMode: true
		}
	}
};

export default config;
