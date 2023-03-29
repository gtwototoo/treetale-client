<script lang="ts">
	import { ICON_TYPE } from '$lib/constants';
	import type { SvelteComponent } from 'svelte';

	let classes: string = '';

	export let type: typeof SvelteComponent;
	export let variation = ICON_TYPE;
	export let style = '';
	export { classes as class };
</script>

<svelte:component this={type} {variation} class={classes} {style} />
