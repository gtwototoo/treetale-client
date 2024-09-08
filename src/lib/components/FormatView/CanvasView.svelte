<script lang="ts">
	import find from 'lodash/find';

	import type { Frame, Progress } from '$lib/types';

	import ReadFrame from './ReadFrame.svelte';

	let {
		frames,
		progress,
		storyId,
		storyState = $bindable()
	}: {
		frames: Frame[];
		progress: Progress[];
		storyId: number;
		storyState: 'begin' | 'ended' | 'started';
	} = $props();
</script>

<div class="flex w-full flex-col items-center gap-10">
	<ReadFrame
		frame={frames?.[0]}
		{storyId}
		bind:storyState
		selectedChoiceId={progress?.[0]?.choiceId}
	/>
	{#each progress as { nextFrameId }, key}
		{@const frame = find(frames, { frameId: nextFrameId })!}
		<ReadFrame {frame} {storyId} selectedChoiceId={progress[key + 1]?.choiceId} bind:storyState />
	{/each}
</div>
