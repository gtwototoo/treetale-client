<script lang="ts">
	import type { Frame } from '$lib/types';

	import ReadFrame from './ReadFrame.svelte';

	let {
		lastFrame,
		storyId,
		storyState = $bindable()
	}: {
		lastFrame: Frame;
		storyId: number;
		storyState: 'begin' | 'ended' | 'started';
	} = $props();
</script>

<ReadFrame frame={lastFrame} {storyId} bind:storyState />
