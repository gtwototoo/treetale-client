<script lang="ts">
	import find from 'lodash/find';
	import last from 'lodash/last';

	import type { Frame, ProgressChoices, Story, User } from '$lib/types';

	import LeftSide from './StoryStage/LeftSide.svelte';
	import StoryStart from './StoryStage/StoryStart.svelte';

	const {
		author,
		frames,
		choices,
		progressVersion,
		story,
		updated
	}: {
		author: {
			subscribersCount: number;
		} & User;
		frames: Frame[];
		choices: ProgressChoices[];
		progressVersion: string;
		story: Story;
		updated: number;
	} = $props();

	const lastFrame = $derived(find(frames, { frameId: last(choices)?.nextFrameId }) as Frame);
</script>

<div
	class="flex w-full max-w-screen-lg select-none flex-row items-start gap-2 max-md:flex-col max-md:items-center"
>
	<LeftSide {story} {author} title={story.title} />
	<div class="flex h-auto w-full flex-col items-start gap-6 text-text max-md:items-center xs:px-6">
		<StoryStart {author} {lastFrame} {choices} {progressVersion} {story} {updated} />
	</div>
</div>
