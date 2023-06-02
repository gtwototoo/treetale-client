<script lang="ts">
	import { ICON_TYPE } from '$lib/constants';
	import type { SvelteComponent } from 'svelte';

	let classes = '';

	export let type: typeof SvelteComponent;
	export let variation: 'solid' | 'outline' = ICON_TYPE;
	export { classes as class };
</script>

<svelte:component this={type} {variation} class={classes} />
