<script lang="ts">
	import type { SvelteComponent } from 'svelte';

	import { ICON_TYPE } from '$lib/constants';

	let className = '';
	export { className as class };

	export let type: typeof SvelteComponent<unknown>;
	export let variation: 'outline' | 'solid' = ICON_TYPE;
</script>

<svelte:component this={type} class={className} {variation} />
