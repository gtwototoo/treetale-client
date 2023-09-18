<script lang="ts">
	import { Carousel } from '$UI';
	import Tag from '$UI/Tag.svelte';
	import { invalidateAll } from '$app/navigation';
	import Frame from '$lib/components/Frame.svelte';
	import Likes from '$lib/components/Likes.svelte';
	import ProfileLink from '$lib/components/ProfileLink.svelte';
	import ReadCard from '$lib/components/ReadCard.svelte';
	import { updateProgress } from '$lib/requests/progress';
	import { bodyColorStore } from '$lib/stores/main.js';
	import { last, rootStyle } from '$lib/utils';
	import clsx from 'clsx';

	export let data;

	let current = data.progress.length + 1;

	const handleKeydown = (e: KeyboardEvent) => {
		e.preventDefault();

		switch (e.key) {
			case 'ArrowLeft':
				if (current > 1) current -= 1;
				break;
			case 'ArrowRight':
				if (current < data.progress.length + 1) current += 1;
				break;
			case 'Space':
				const lastFrameChoices = last(data.frames)?.choices;
				if (lastFrameChoices && lastFrameChoices.length === 1) {
					setChoice(lastFrameChoices[0].choiceId);
				}
				break;
		}
	};

	const setChoice = async (choiceId: number) => {
		try {
			await updateProgress(storyId, choiceId);
			await invalidateAll();

			current = data.progress.length;
		} catch (e) {
			console.error(e);
		}
	};

	$: ({ storyId, title, description, author, created, draft, likes, vars } = data.story);
</script>

<svelte:head>
	<title>{title}</title>
	{@html rootStyle($bodyColorStore)}
</svelte:head>

<svelte:window on:keydown={handleKeydown} />

<div class="flex grow bg-transparent">
	<Carousel class="w-full min-h-full p-4" {current}>
		<div class="plug max-md:!hidden">
			<div class="max-w-md min-w-[16rem]" />
		</div>
		<ReadCard>
			<svelte:fragment slot="body">
				<h2>{title}</h2>
				<p>{description}</p>
				<div class="flex items-center gap-4">
					{#if author}
						<ProfileLink data={author} {created} />
					{:else}
						<Tag
							class={clsx(
								draft ? 'bg-gray-300 text-gray-600' : 'bg-emerald-300 text-emerald-600'
							)}
						>
							{draft ? 'Черновик' : 'Публичный'}
						</Tag>
					{/if}
					<Likes {storyId} {likes} />
				</div>
			</svelte:fragment>
		</ReadCard>
		{#each data.frames as frame, key}
			<div class="plug">
				<Frame
					{frame}
					{vars}
					{setChoice}
					selectedChoiceId={data.progress[key].choiceId}
					last={key === data.frames.length - 1}
				/>
			</div>
		{/each}
		<div class="plug max-md:!hidden">
			<div class="max-w-md min-w-[16rem]" />
		</div>
	</Carousel>
</div>

<style lang="postcss">
	.plug {
		@apply flex h-full w-1/3 items-center justify-center px-2;
	}
</style>
