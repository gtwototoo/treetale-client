<script lang="ts">
	import type { FormatValues, Genre } from '$lib/types';
	import Button from '$lib/ui/Button.svelte';
	import { button } from '$lib/ui/presets';
	import { clm } from '$lib/utils/classMerge';

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
	<div class="flex gap-3 *:gap-3">
		<Button
			asLink
			class={clm(button.type.primary, button.size.lg, 'py-2 pl-3')}
			href="/?genres={genre.id}"
		>
			<GenreIcon class="text-main size-8" />
			<p>{genre.title}</p>
		</Button>
		<Button
			asLink
			class={clm(button.type.primary, button.size.lg, 'py-2 pl-3')}
			href="/?format={format.id}"
		>
			<FormatIcon class="text-main size-8" />
			<p>{format.title}</p>
		</Button>
	</div>
	<Likes {likes} {storyId} class="pr-4" />
</div>
