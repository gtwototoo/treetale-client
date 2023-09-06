<script lang="ts">
	import { ICON_TYPE } from '$lib/constants';
	import type { SvelteComponent } from 'svelte';

	let className = '';

	export let type: typeof SvelteComponent<any>;
	export let variation: 'solid' | 'outline' = ICON_TYPE;
	export { className as class };
</script>

<svelte:component this={type} {variation} class={className} />
