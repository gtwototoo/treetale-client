<script lang="ts">
	import type { Component } from 'svelte';

	import type { EmblaOptionsType } from 'embla-carousel';
	import emblaCarouselSvelte from 'embla-carousel-svelte';
	import find from 'lodash/find';
	import range from 'lodash/range';
	import { Icon } from 'treetale-ui';

	import AddStoryButton from '$lib/components/AddStoryButton.svelte';
	import StoriesList from '$lib/components/StoriesList.svelte';
	import Empty from '$lib/components/StoryCard/Empty.svelte';
	import StoryCard from '$lib/components/StoryCard/index.svelte';
	import type { Story, User } from '$lib/types';
	import { correctWhitespace } from '$lib/utils/text';

	const {
		authors,
		icon,
		listFormat = false,
		stories,
		title
	}: {
		authors: ({ subscribersCount: number } & User)[];
		icon: Component;
		listFormat?: boolean;
		stories: Story[];
		title: string;
	} = $props();

	const options: EmblaOptionsType = {
		align: 'start',
		dragFree: true
	};
</script>

<div class="flex h-full flex-col">
	<div class="flex items-center gap-3 py-2 pl-8 select-none max-sm:py-1 max-sm:pl-4">
		<div class="bg-main-400 rounded-full p-2">
			<Icon class="size-6 max-sm:size-5" this={icon} />
		</div>
		<h2 class="text-2xl max-md:text-xl">{title}</h2>
	</div>
	{#if listFormat}
		<StoriesList {authors} {stories}>
			<p>
				{correctWhitespace(
					'Историй по вашему запросу не найдено, а значит вы можете добавить свою уникальную историю'
				)}
			</p>
			<AddStoryButton />
		</StoriesList>
	{:else}
		<div class="p-4 max-sm:p-3" use:emblaCarouselSvelte={{ options, plugins: [] }}>
			<div class="flex justify-start gap-4">
				{#each stories as story (story.storyId)}
					{@const author = find(authors, { userId: story.userId })}
					<StoryCard class="slider-card" {author} {story} />
				{/each}
				{#if stories.length < 6}
					{#each range(6 - stories.length) as index (index)}
						<Empty class="slider-card" />
					{/each}
				{/if}
			</div>
		</div>
	{/if}
</div>

<style lang="postcss">
	@reference "../../app.css";

	:global(.slider-card) {
		@apply w-[30vw] max-w-[21.25rem] min-w-48 shrink-0 select-none;
	}
</style>
