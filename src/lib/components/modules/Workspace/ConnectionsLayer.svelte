<script lang="ts">
	import { frames } from '$lib/stores/editing';
	import { createConnections } from '$lib/utils/editing';
	import { createEventDispatcher, onMount } from 'svelte';

	const dispatch = createEventDispatcher();

	$: ({ paths, ...svgData } = createConnections($frames));

	onMount(() => dispatch('mounted'));
</script>

<svg class="absolute h-auto w-auto select-none bg-transparent stroke-text stroke-2" {...svgData}>
	{#each paths as path (path.connectId)}
		<path d={path.line} />
	{/each}
</svg>
