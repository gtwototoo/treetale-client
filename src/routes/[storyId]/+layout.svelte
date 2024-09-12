<script lang="ts">
	import ReadingHeader from '$lib/components/Header/ReadingHeader.svelte';
	import { interfaceStore } from '$lib/stores/reading.svelte';

	let { children } = $props();
</script>

<div class="fixed size-full overflow-auto">
	{#if interfaceStore.show}
		<ReadingHeader />
	{/if}
	{@render children()}
</div>
