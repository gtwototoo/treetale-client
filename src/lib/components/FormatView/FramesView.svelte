<script lang="ts">
	import type { Frame } from '$lib/types';

	import ReadFrame from './ReadFrame/index.svelte';

	const {
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
