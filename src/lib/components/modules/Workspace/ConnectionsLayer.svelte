<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';

	import { framesDataStore } from '$lib/stores/workspace';
	import { createConnections } from '$lib/utils';

	const dispatch = createEventDispatcher();

	$: ({ paths, ...svgData } = createConnections($framesDataStore));

	onMount(() => dispatch('mounted'));
</script>

<svg
	class="absolute h-auto w-auto select-none bg-transparent stroke-contrast stroke-2"
	{...svgData}
>
	{#each paths as path (path.connectId)}
		<path d={path.line} />
	{/each}
</svg>
