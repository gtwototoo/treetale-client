<script lang="ts">
	import find from 'lodash/find';
	import last from 'lodash/last';

	import type { Frame, Progress, Story, User } from '$lib/types';

	import EndResults from './StoryStage/EndResults.svelte';
	import LeftSide from './StoryStage/LeftSide.svelte';
	import StoryStart from './StoryStage/StoryStart.svelte';

	let {
		author,
		frames,
		progress,
		progressVersion,
		story,
		storyState = $bindable(),
		updated
	}: {
		author: {
			subscribersCount: number;
		} & User;
		frames: Frame[];
		progress: Progress[];
		progressVersion: string;
		story: Story;
		storyState: 'begin' | 'ended' | 'started';
		updated: number;
	} = $props();

	let lastFrame = $derived(find(frames, { frameId: last(progress)?.nextFrameId }) as Frame);
</script>

<div
	class="flex w-full max-w-screen-lg select-none flex-row items-start gap-2 max-md:flex-col max-md:items-center"
>
	<LeftSide {story} {author} />
	<div class="flex h-auto w-full flex-col items-start gap-6 text-text max-md:items-center xs:px-6">
		{#if storyState === 'ended'}
			<EndResults
				bind:storyState
				{story}
				choicesCount={progress.length}
				endFrame={lastFrame}
				{progressVersion}
			/>
		{:else}
			<StoryStart
				bind:storyState
				{author}
				{lastFrame}
				{progress}
				{progressVersion}
				{story}
				{updated}
			/>
		{/if}
	</div>
</div>
