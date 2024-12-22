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

<div class="flex *:pointer-events-auto *:gap-3 *:rounded-full *:pl-4 hover:*:bg-main-50">
	<Button asLink size="lg" href={`/?genres=${genre.id}`}>
		<GenreIcon class="size-6" />
		<p>{genre.title}</p>
	</Button>
	<Button asLink size="lg" href={`/?format=${format.id}`}>
		<FormatIcon class="size-6" />
		<p>{format.title}</p>
	</Button>
</div>
