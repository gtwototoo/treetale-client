<script lang="ts">
	import ReadFrame from './ReadFrame.svelte';

	import type { Frame } from '$lib/types';

	let {
		lastFrame,
		storyId,
		progressId
	}: {
		lastFrame: Frame;
		storyId: number;
		progressId: number;
	} = $props();
</script>

<ReadFrame frame={lastFrame} {storyId} {progressId} />
