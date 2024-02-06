<script lang="ts">
	import find from 'lodash/find';

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

	$: icon = find(GENRES_LIST, { id: genre }).icon;
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
		<svelte:component this={icon} class="absolute right-4 top-4 size-8 text-contrast" />
	{:else}
		<svelte:component this={icon} class="h-2/3 w-auto text-contrast" />
	{/if}
</div>
