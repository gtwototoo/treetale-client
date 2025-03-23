<script lang="ts">
	import { Button } from 'treetale-ui';

	import type { FormatValues, Genre } from '$lib/types';

	import Likes from '../LeftSide/Likes.svelte';

	const {
		format,
		genre,
		storyId,
		likes
	}: {
		format: FormatValues;
		genre: Genre;
		storyId: number;
		likes: number[];
	} = $props();

	const GenreIcon = $derived(genre.icon);
	const FormatIcon = $derived(format.icon);
</script>

<div class="flex w-full justify-between gap-3">
	<div class="*:bg-main-200 *:hover:bg-main-300 flex gap-3 *:pointer-events-auto *:gap-3 *:pl-4">
		<Button asLink size="lg" href="/?genres={genre.id}">
			<GenreIcon class="text-main size-6" />
			<p>{genre.title}</p>
		</Button>
		<Button asLink size="lg" href="/?format={format.id}">
			<FormatIcon class="text-main size-6" />
			<p>{format.title}</p>
		</Button>
	</div>
	<Likes {likes} {storyId} class="pointer-events-auto pr-4" />
</div>
