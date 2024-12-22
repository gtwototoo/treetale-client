<script lang="ts">
	import ReadingHeader from '$lib/components/Header/ReadingHeader.svelte';
	import { fullscreenStore, interfaceStore } from '$lib/stores/reading.svelte';

	const { children } = $props();

	const handleFullscreenChange = () => {
		fullscreenStore.isEnabled = !!document.fullscreenElement;
	};
</script>

<svelte:window onfullscreenchange={handleFullscreenChange} />

<div class="fixed size-full overflow-auto">
	{#if interfaceStore.show}
		<ReadingHeader />
	{/if}
	{@render children()}
</div>
