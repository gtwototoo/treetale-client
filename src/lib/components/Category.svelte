<script lang="ts">
	import type { EmblaOptionsType } from 'embla-carousel';
	import emblaCarouselSvelte from 'embla-carousel-svelte';
	import find from 'lodash/find';
	import range from 'lodash/range';
	import { type HeroIconComponent, Icon } from 'treetale-ui';

	import AddStoryButton from '$lib/components/AddStoryButton.svelte';
	import StoriesList from '$lib/components/StoriesList.svelte';
	import Empty from '$lib/components/StoryCard/Empty.svelte';
	import StoryCard from '$lib/components/StoryCard.svelte';
	import type { Story, User } from '$lib/types';
	import { correctWhitespace } from '$lib/utils/text';

	let {
		authors,
		icon,
		listFormat = false,
		stories,
		title
	}: {
		authors: ({ subscribersCount: number } & User)[];
		icon: HeroIconComponent;
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
	<div class="flex select-none items-center gap-4 py-3 pl-12 max-sm:py-2 max-sm:pl-6">
		<Icon class="size-8 max-sm:h-6 max-sm:w-6" this={icon} />
		<h2 class="text-2xl max-md:text-xl">{title}</h2>
	</div>
	{#if listFormat}
		<StoriesList {authors} {stories}>
			<p>
				{correctWhitespace(
					'Историй по вашему запросу не найдено, а значит вы можете добавить свою уникальную историю'
				)}
			</p>
			<AddStoryButton class="gap-3 bg-main-50 text-text hover:bg-main-70" />
		</StoriesList>
	{:else}
		<div class="p-4 max-sm:p-3" use:emblaCarouselSvelte={{ options, plugins: [] }}>
			<div class="flex justify-start gap-4">
				{#each stories as story (story.storyId)}
					{@const author = find(authors, { userId: story.userId })}
					<StoryCard class="slider-card" {author} {story} />
				{/each}
				{#if stories.length < 6}
					{#each range(6 - stories.length) as _}
						<Empty class="slider-card" />
					{/each}
				{/if}
			</div>
		</div>
	{/if}
</div>

<style lang="postcss">
	:global(.slider-card) {
		@apply w-[30vw] min-w-48 max-w-[21.25rem] shrink-0 select-none;
	}
</style>
