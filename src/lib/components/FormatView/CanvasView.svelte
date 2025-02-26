<script lang="ts">
	import find from 'lodash/find';

	import type { Frame, ProgressChoices } from '$lib/types';

	import ReadFrame from './ReadFrame/index.svelte';

	const {
		frames,
		choices,
		storyId,
		progressId
	}: {
		frames: Frame[];
		choices: ProgressChoices[];
		storyId: number;
		progressId: number;
	} = $props();
</script>

<div class="flex w-full flex-col items-center gap-10">
	<ReadFrame
		frame={frames?.[0]}
		{storyId}
		selectedChoiceId={choices?.[0]?.choiceId}
		{progressId}
	/>
	{#each choices as { nextFrameId, choiceId }, index (choiceId)}
		{@const frame = find(frames, { frameId: nextFrameId })!}
		<ReadFrame {frame} {storyId} selectedChoiceId={choices[index + 1]?.choiceId} {progressId} />
	{/each}
</div>
