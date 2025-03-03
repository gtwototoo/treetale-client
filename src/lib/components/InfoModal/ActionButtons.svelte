<script lang="ts">
	import { Button } from 'treetale-ui';

	import type { FormatValues, Genre } from '$lib/types';

	const {
		format,
		genre
	}: {
		format: FormatValues;
		genre: Genre;
		storyId: number;
	} = $props();

	const GenreIcon = $derived(genre.icon);
	const FormatIcon = $derived(format.icon);
</script>

<div
	class="*:bg-main-200 *:hover:bg-main-500 flex gap-3 *:pointer-events-auto *:gap-3 *:rounded-full *:pl-4"
>
	<Button asLink size="lg" href="/?genres={genre.id}">
		<GenreIcon class="text-main size-6" />
		<p>{genre.title}</p>
	</Button>
	<Button asLink size="lg" href="/?format={format.id}">
		<FormatIcon class="text-main size-6" />
		<p>{format.title}</p>
	</Button>
</div>
