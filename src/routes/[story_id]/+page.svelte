<script lang="ts">
	import { Carousel } from '$UI';
	import Tag from '$UI/Tag.svelte';
	import { invalidateAll } from '$app/navigation';
	import Frame from '$lib/components/Frame.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Likes from '$lib/components/Likes.svelte';
	import ProfileLink from '$lib/components/ProfileLink.svelte';
	import ReadCard from '$lib/components/ReadCard.svelte';
	import SvgGradient from '$lib/components/modules/StoriesList/SvgGradient.svelte';
	import { updateProgress } from '$lib/requests/progress';
	import { bodyColorStore } from '$lib/stores/main.js';
	import { last, rootStyle } from '$lib/utils';
	import clsx from 'clsx';
	import { BookOpen } from 'svelte-heros-v2';

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
			invalidateAll();

			current = data.progress.length;
		} catch (e) {
			console.error(e);
		}
	};

	$: ({ storyId, title, description, author, created, draft, likes, vars, color } = data.story);
	$: $bodyColorStore = color;
</script>

<svelte:head>
	<title>{title}</title>
	{@html rootStyle($bodyColorStore, {
		'fill-gradient': `url(#light-gradient-${storyId})`
	})}
</svelte:head>

<svelte:window on:keydown={handleKeydown} />

<SvgGradient id={storyId} />
<div class="flex grow bg-transparent">
	<Carousel class="w-full min-h-full p-4" {current}>
		<div class="plug max-md:!hidden">
			<div class="max-w-md min-w-[16rem]" />
		</div>
		<div class="plug">
			<ReadCard>
				<svelte:fragment slot="body">
					<Icon
						type={BookOpen}
						class="h-44 max-hd:h-36 max-xl:h-28 w-auto childs:fill-gradient"
						variation="solid"
					/>
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
		</div>
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
		@apply flex h-full w-1/3 items-center justify-start px-2;
	}
</style>
