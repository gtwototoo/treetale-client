<script lang="ts">
	import { theme, type Theme } from '$lib/stores/colors.svelte';

	import '../app.css';
	import '../fonts/RobotoSlab.css';
	import SvgGradient from './SvgGradient.svelte';

	const { children } = $props();

	$effect(() => {
		if (typeof window !== 'undefined') {
			const themeStorage = window.localStorage.getItem('theme') as Theme | undefined;
			if (themeStorage && themeStorage !== theme.type) theme.type = themeStorage;
		}
	});
</script>

<SvgGradient />

{@render children()}
