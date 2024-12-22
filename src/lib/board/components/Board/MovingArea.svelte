<script lang="ts">
	import type { Snippet } from 'svelte';

	import { boardStateStore } from '$board/stores/index.svelte';
	import { transform } from '$board/utils/coordinatesToCss';

	let position = $derived(transform(boardStateStore.offset, boardStateStore.zoom / 100));

	const {
		children
	}: {
		children: Snippet;
	} = $props();
</script>

<div class="absolute" style={position}>
	{@render children()}
</div>
