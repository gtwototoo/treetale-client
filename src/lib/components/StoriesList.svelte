<script lang="ts">
	import type { Snippet } from 'svelte';

	import find from 'lodash/find';
	import range from 'lodash/range';

	import type { Story, User } from '$lib/types';

	import Empty from './StoryCard/Empty.svelte';
	import StoryCard from './StoryCard/StoryCard.svelte';

	let {
		authors,
		children,
		stories
	}: {
		authors?: User[];
		children?: Snippet;
		stories: Story[];
	} = $props();
</script>

{#if stories.length}
	<div
		class="grid w-full items-start justify-center gap-4 p-4 grid-columns-fit-60 max-md:grid-columns-fit-40 max-sm:gap-2 max-sm:p-2"
	>
		{#each stories as story}
			{@const author = find(authors, { userId: story.userId })}
			<StoryCard {author} {story} />
		{/each}
		{#if stories.length < 8}
			{#each range(8 - stories.length) as _}
				<Empty />
			{/each}
		{/if}
	</div>
{:else}
	<div class="plug flex-grow gap-8">
		{@render children?.()}
	</div>
{/if}
