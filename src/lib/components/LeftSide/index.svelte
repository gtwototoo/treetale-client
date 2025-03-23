<script lang="ts">
	import find from 'lodash/find';

	import { DEFAULT_COLOR } from '$lib/constants/colors';
	import { GENRES_LIST } from '$lib/constants/genres';
	import type { Story, User } from '$lib/types';

	import AuthorInfo from '../AuthorInfo/index.svelte';
	import Cover from '../StoryCard/Cover.svelte';

	const {
		author,
		story,
		title
	}: {
		author?: {
			subscribersCount: number;
		} & User;
		story: Story;
		title: string;
	} = $props();

	const { color, created, imageUrl, status } = $derived(story);
	const selectedColor = $derived(color || DEFAULT_COLOR);
	const genre = $derived(find(GENRES_LIST, { id: story.genre })!);
</script>

<div class="flex shrink-0 flex-col gap-3 md:sticky md:top-20 md:w-1/3">
	<AuthorInfo
		{author}
		{created}
		edit={false}
		{status}
		{selectedColor}
		class="bg-main-200 hover:bg-main-300 grow"
	/>
	<Cover
		{imageUrl}
		{title}
		icon={genre.icon}
		color={selectedColor}
		class="w-auto shrink-0 self-start max-md:w-full"
	/>
</div>
