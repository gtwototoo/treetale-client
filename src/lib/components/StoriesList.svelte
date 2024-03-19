<script lang="ts">
	import find from 'lodash/find';
	import range from 'lodash/range';

	import type { IUser } from '$lib/types';
	import type { IStoryFull } from '$lib/types/reading';

	import Empty from './modules/StoryCard/Empty.svelte';
	import StoryCard from './modules/StoryCard/StoryCard.svelte';

	export let stories: Array<IStoryFull>;
	export let authors: Array<IUser> | undefined = undefined;
</script>

{#if stories.length}
	<div class="stories">
		{#each stories as rawStory}
			{@const { userId, vars, ...story } = rawStory}
			{@const author = find(authors, { userId })}
			<StoryCard {author} {story} {vars} />
		{/each}
		{#if stories.length < 8}
			{#each range(8 - stories.length) as _}
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
		@apply grid w-full items-start justify-center gap-4 p-4 grid-columns-fit-60 max-md:grid-columns-fit-40 max-sm:gap-2 max-sm:p-2;
	}
</style>
