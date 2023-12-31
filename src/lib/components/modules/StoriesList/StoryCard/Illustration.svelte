<script lang="ts">
	import { Image } from '$UI';
	import Icon from '$lib/components/Icon.svelte';
	import { GENRES_LIST } from '$lib/constants';
	import type { TGenre } from '$lib/types';
	import { BookOpen } from 'svelte-heros-v2';

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
			on:error={handleError}
			alt={title || 'Иллюстрация истории'}
			cover
			class="h-full w-full rounded-t-xl xs:rounded-t-2xl"
			src={imageUrl}
		/>
		<Icon type={icon} class="absolute right-4 top-4 h-8 w-8 text-contrast" variation="solid" />
	{:else}
		<Icon type={icon} class="h-2/3 w-auto text-contrast" variation="solid" />
	{/if}
</div>
