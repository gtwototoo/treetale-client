<script lang="ts">
	import ReadingHeader from '$lib/components/Header/ReadingHeader.svelte';

	let { children } = $props();
</script>

<div class="fixed left-0 flex size-full flex-col">
	<ReadingHeader />
	{@render children()}
</div>
