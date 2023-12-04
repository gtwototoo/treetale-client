<script lang="ts">
	import type { IUser } from '$lib/types';
	import type { IStoryFull } from '$lib/types/reading';
	import emblaCarouselSvelte, {
		type EmblaOptionsType,
		type EmblaPluginType
	} from 'embla-carousel-svelte';
	import type { SvelteComponent } from 'svelte';
	import Icon from '../Icon.svelte';
	import StoryCard from './StoriesList/StoryCard/index.svelte';

	export let title: string;
	export let stories: Array<IStoryFull>;
	export let authors: Array<IUser>;
	export let icon: typeof SvelteComponent<unknown>;

	let options: EmblaOptionsType = {
		align: 'start',
		dragFree: true
	};

	let plugins: Array<EmblaPluginType> = [];
</script>

{#if stories.length}
	<div class="flex flex-col gap-2 overflow-hidden">
		<div class="sticky top-0 z-10 flex select-none items-center gap-4 py-3 pl-12">
			<Icon type={icon} class="h-8 w-8" />
			<h2 class="text-2xl max-md:text-xl">{title}</h2>
		</div>
		<div class="px-2 sm:px-4" use:emblaCarouselSvelte={{ options, plugins }}>
			<div class="flex justify-start gap-4">
				{#each stories as rawStory}
					{@const { vars, ...story } = rawStory}
					{@const author = authors && authors.find(({ userId }) => userId === story.userId)}
					<StoryCard
						{story}
						{vars}
						{author}
						class="w-96 max-lg:w-80 max-md:w-72 max-sm:w-60"
					/>
				{/each}
			</div>
		</div>
	</div>
{/if}
