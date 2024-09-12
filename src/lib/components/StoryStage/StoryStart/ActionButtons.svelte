<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { MouseEventHandler } from 'svelte/elements';

	import { PUBLIC_TREETALE_CLIENT_URL } from '$env/static/public';
	import { DocumentDuplicate } from 'svelte-heros-v2';
	import { Button, Icon } from 'treetale-ui';

	import type { FormatValues, Genre } from '$lib/types';

	import { clm } from '$lib/utils/classMerge';

	type CopyState = 'error' | 'success' | null;

	let {
		format,
		genre,
		storyId
	}: {
		format: FormatValues;
		genre: Genre;
		storyId: number;
	} = $props();

	let copyState = $state<CopyState>(null);

	const copyText = async (value: string): Promise<boolean> => {
		let success = true;

		try {
			await window.navigator.clipboard.writeText(value);
		} catch (error) {
			console.error(error);

			success = true;
		}

		return success;
	};

	const handleCopyLink: MouseEventHandler<HTMLAnchorElement | HTMLButtonElement> = async (e) => {
		e.stopPropagation();

		copyState = (await copyText(textForCopy)) ? 'success' : 'error';
	};

	let textForCopy = $derived(`${PUBLIC_TREETALE_CLIENT_URL}/${storyId}`);
	let GenreIcon = $derived(genre.icon);
	let FormatIcon = $derived(format.icon);

	$effect(() => {
		if (copyState) {
			const timeout = setTimeout(() => {
				copyState = null;
			}, 500);

			onDestroy(() => {
				clearTimeout(timeout);
			});
		}
	});
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
	<Button size="lg" onclick={handleCopyLink}>
		<Icon
			this={DocumentDuplicate}
			class={clm(
				'size-6 *:stroke-2',
				copyState === 'success' && 'text-green-500',
				copyState === 'error' && 'text-red-500'
			)}
		/>
		<p>Ссылка</p>
	</Button>
</div>
