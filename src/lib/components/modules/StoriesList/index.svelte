<script lang="ts">
	import type { IStoryFull } from '$lib/types/reading';
	import Empty from './Empty.svelte';
	import StoryCard from './StoryCard/index.svelte';

	export let stories: Array<IStoryFull>;
</script>

{#if stories.length}
	<div class="stories">
		{#each stories as rawStory}
			{@const { vars, author, ...story } = rawStory}
			<StoryCard {story} {vars} {author} />
		{/each}
		{#if stories.length < 8}
			{#each Array(8 - stories.length).fill(undefined) as _}
				<Empty />
			{/each}
		{/if}
	</div>
{:else}
	<div class="plug flex-grow gap-8">
		<slot />
	</div>
{/if}

<style lang="postcss">
	.stories {
		@apply grid w-full items-start justify-center gap-2 p-2 grid-columns-fit-40 xs:grid-columns-fit-64 sm:gap-4 sm:p-4 lg:grid-columns-fit-72;
	}
</style>
