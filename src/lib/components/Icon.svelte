<script lang="ts">
	import { ICON_TYPE } from '$lib/constants';
	import type { SvelteComponent } from 'svelte';

	let className = '';
	export { className as class };

	export let type: typeof SvelteComponent<unknown>;
	export let variation: 'solid' | 'outline' = ICON_TYPE;
</script>

<svelte:component this={type} {variation} class={className} />
