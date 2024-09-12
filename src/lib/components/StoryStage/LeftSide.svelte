<script lang="ts">
	import find from 'lodash/find';

	import type { Story, User } from '$lib/types';

	import { DEFAULT_COLOR } from '$lib/constants/colors';
	import { GENRES_LIST } from '$lib/constants/genres';

	import Info from '../Info.svelte';
	import Likes from '../Likes.svelte';
	import Cover from '../StoryCard/Cover.svelte';

	let {
		author,
		story
	}: {
		author?: {
			subscribersCount: number;
		} & User;
		story: Story;
	} = $props();

	let { color, created, imageUrl, likes, status, storyId, title } = $derived(story);
	let selectedColor = $derived(color.length ? color : DEFAULT_COLOR);
	let genre = $derived(find(GENRES_LIST, { id: story.genre })!);
</script>

<div class="flex shrink-0 flex-col gap-3 md:w-1/3">
	<div class="flex gap-2 *:pointer-events-auto">
		<Info
			{author}
			{created}
			edit={false}
			{status}
			{selectedColor}
			class="grow bg-main-50 hover:bg-main-70"
		/>
		<Likes {likes} {storyId} class="rounded-full pr-4" />
	</div>
	<Cover
		{imageUrl}
		{title}
		icon={genre.icon}
		color={selectedColor}
		class="w-auto shrink-0 self-start max-md:w-full md:sticky md:top-20"
	/>
</div>
