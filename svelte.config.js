import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/kit/vite';
import { preprocessor as documentPreprocessor } from '@sveltekit-addons/document';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		alias: {
			$UI: 'src/lib/UI'
		}
	},

	preprocess: [
		vitePreprocess(),
		documentPreprocessor(),
		preprocess({
			postcss: true
		})
	],

	vitePlugin: {
		inspector: {
			holdMode: true
		}
	}
};

export default config;
