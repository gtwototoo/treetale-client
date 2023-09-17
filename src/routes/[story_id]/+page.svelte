<script lang="ts">
	import { Carousel } from '$UI';
	import { invalidateAll } from '$app/navigation';
	import Frame from '$lib/components/Frame.svelte';
	import { updateProgress } from '$lib/requests/progress';
	import { bodyColorStore } from '$lib/stores/main.js';
	import { last, rootStyle } from '$lib/utils';

	export let data;

	const handleKeydown = (e: KeyboardEvent) => {
		e.preventDefault();

		switch (e.key) {
			case 'ArrowLeft':
				if (current > 1) current -= 1;
				break;
			case 'ArrowRight':
				if (current < data.progress.length) current += 1;
				break;
			case 'Space':
				const lastFrameChoices = last(data.frames)?.choices;
				if (lastFrameChoices && lastFrameChoices.length === 1) {
					setChoice(lastFrameChoices[0].choiceId);
				}
				break;
		}
	};

	const setChoice = async (id: number) => {
		try {
			await updateProgress(data.story.storyId, id);
			await invalidateAll();

			current = data.progress.length;
		} catch (e) {
			console.error(e);
		}
	};

	$: current = data.progress.length;
</script>

<svelte:head>
	<title>{data.story.title}</title>
	{@html rootStyle($bodyColorStore)}
</svelte:head>

<svelte:window on:keydown={handleKeydown} />

<div class="flex grow bg-transparent">
	<Carousel class="w-full min-h-full p-4" {current}>
		<div class="plug max-md:hidden">
			<div class="max-w-md min-w-[16rem]" />
		</div>
		{#each data.frames as frame, key}
			<div class="plug">
				<Frame
					{frame}
					vars={data.story.vars}
					{setChoice}
					selectedChoiceId={data.progress[key].choiceId}
					last={key === data.frames.length - 1}
				/>
			</div>
		{/each}
		<div class="plug max-md:hidden">
			<div class="max-w-md min-w-[16rem]" />
		</div>
	</Carousel>
</div>

<style lang="postcss">
	.plug {
		@apply flex h-full w-full items-center justify-center px-2 md:w-1/3;
	}
</style>
