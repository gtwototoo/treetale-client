<script lang="ts">
	import { BookOpen } from 'svelte-heros-v2';

	import type { TGenre } from '$lib/types';

	import { Image } from '$UI';
	import { GENRES_LIST } from '$lib/constants';

	export let title: string;
	export let imageUrl: string;
	export let genre: TGenre;

	let errorImage = false;

	const handleError = () => {
		errorImage = true;
	};

	$: icon = genre ? GENRES_LIST.find(({ id }) => genre === id)?.icon : BookOpen;
</script>

<div
	class="relative flex h-56 w-full shrink-0 items-end justify-center bg-transparent text-main max-hd:h-48 max-xl:h-40 max-md:h-32 max-sm:h-24"
>
	{#if imageUrl && !errorImage}
		<Image
			alt={title || 'Иллюстрация истории'}
			class="h-full w-full rounded-t-xl xs:rounded-t-2xl"
			cover
			on:error={handleError}
			src={imageUrl}
		/>
		<svelte:component class="absolute right-4 top-4 h-8 w-8 text-contrast" this={icon} />
	{:else}
		<svelte:component class="h-2/3 w-auto text-contrast" this={icon} />
	{/if}
</div>
