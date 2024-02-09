<script lang="ts">
	import type { EmblaOptionsType } from 'embla-carousel';

	import type { SvelteComponent } from 'svelte';

	import emblaCarouselSvelte from 'embla-carousel-svelte';
	import find from 'lodash/find';
	import range from 'lodash/range';

	import type { IUser } from '$lib/types';
	import type { IStoryFull } from '$lib/types/reading';

	import AddStoryButton from '$lib/components/AddStoryButton.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Empty from '$lib/components/modules/StoriesList/Empty.svelte';
	import StoriesList from '$lib/components/modules/StoriesList/StoriesList.svelte';
	import StoryCard from '$lib/components/modules/StoriesList/StoryCard/StoryCard.svelte';
	import { correctWhitespace } from '$lib/utils';

	export let title: string;
	export let stories: Array<IStoryFull>;
	export let authors: Array<IUser>;
	export let icon: typeof SvelteComponent<unknown>;
	export let listFormat = false;

	const options: EmblaOptionsType = {
		align: 'start',
		dragFree: true
	};
</script>

<div class="flex h-full flex-col">
	<div class="flex select-none items-center gap-4 py-3 pl-12 max-sm:py-2 max-sm:pl-6">
		<Icon class="size-8 max-sm:h-6 max-sm:w-6" type={icon} />
		<h2 class="text-2xl max-md:text-xl">{title}</h2>
	</div>
	{#if listFormat}
		<StoriesList {authors} {stories}>
			<p>
				{correctWhitespace(
					'Историй по вашему запросу не найдено, а значит вы можете добавить свою уникальную историю'
				)}
			</p>
			<AddStoryButton class="gap-3 bg-contrast text-text" />
		</StoriesList>
	{:else}
		<div class="p-4 max-sm:p-3" use:emblaCarouselSvelte={{ options, plugins: [] }}>
			<div class="flex justify-start gap-4">
				{#each stories as rawStory (rawStory.storyId)}
					{@const { userId, vars, ...story } = rawStory}
					{@const author = find(authors, { userId })}
					<StoryCard
						{author}
						class="w-96 max-lg:w-80 max-md:w-72 max-xs:w-60"
						{story}
						{vars}
					/>
				{/each}
				{#if stories.length < 5}
					{#each range(5 - stories.length) as _}
						<Empty class="w-96 shrink-0 max-lg:w-80 max-md:w-72 max-xs:w-60" />
					{/each}
				{/if}
			</div>
		</div>
	{/if}
</div>
