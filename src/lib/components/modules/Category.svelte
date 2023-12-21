<script lang="ts">
	import type { IUser } from '$lib/types';
	import type { IStoryFull } from '$lib/types/reading';
	import { correctWhitespace } from '$lib/utils';
	import emblaCarouselSvelte, {
		type EmblaOptionsType,
		type EmblaPluginType
	} from 'embla-carousel-svelte';
	import type { SvelteComponent } from 'svelte';
	import AddStoryButton from '../AddStoryButton.svelte';
	import Icon from '../Icon.svelte';
	import StoriesList from './StoriesList/StoriesList.svelte';
	import StoryCard from './StoriesList/StoryCard/StoryCard.svelte';

	export let title: string;
	export let stories: Array<IStoryFull>;
	export let authors: Array<IUser>;
	export let icon: typeof SvelteComponent<unknown>;
	export let listFormat = false;

	const options: EmblaOptionsType = {
		align: 'start',
		dragFree: true
	};

	const plugins: Array<EmblaPluginType> = [];
</script>

<div class="flex h-full flex-col">
	<div
		class="sticky top-0 z-10 flex select-none items-center gap-4 py-3 pl-12 max-sm:py-2 max-sm:pl-6"
	>
		<Icon type={icon} class="h-8 w-8 max-sm:h-6 max-sm:w-6" />
		<h2 class="text-2xl max-md:text-xl">{title}</h2>
	</div>
	{#if listFormat}
		<StoriesList {stories} {authors}>
			<p>
				{correctWhitespace(
					'Историй по вашему запросу не найдено, а значит вы можете добавить свою уникальную историю'
				)}
			</p>
			<AddStoryButton class="gap-3 bg-contrast text-text" />
		</StoriesList>
	{:else}
		<div class="overflow-hidden p-4 max-sm:p-3" use:emblaCarouselSvelte={{ options, plugins }}>
			<div class="flex justify-start gap-4">
				{#each stories as rawStory}
					{@const { vars, ...story } = rawStory}
					{@const author = authors && authors.find(({ userId }) => userId === story.userId)}
					<StoryCard
						{story}
						{vars}
						{author}
						class="w-96 max-lg:w-80 max-md:w-72 max-xs:w-60"
					/>
				{/each}
			</div>
		</div>
	{/if}
</div>
