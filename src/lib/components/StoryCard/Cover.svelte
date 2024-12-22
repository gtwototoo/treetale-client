<script lang="ts">
	import type { Component } from 'svelte';

	import { Image } from 'treetale-ui';

	import type { RGB } from '$lib/types';
	import { clm } from '$lib/utils/classMerge';
	import { contrastText } from '$lib/utils/contrast';

	import Titie from './Titie.svelte';
	import TransparentRect from './TransparentRect.svelte';

	const {
		class: classname,
		color,
		editMode,
		icon,
		imageUrl,
		title
	}: {
		class?: string;
		color: RGB;
		editMode?: boolean;
		icon: Component;
		imageUrl: null | string;
		title: string;
	} = $props();

	let errorImage = $state(false);

	const handleError = () => {
		errorImage = true;
	};

	const gradientBackgroundColor = $derived(
		contrastText(color) ? clm('from-main to-main-50') : clm('from-main-70 to-main')
	);
	const iconColor = $derived(contrastText(color) ? clm('text-main-60') : clm('text-main'));
	const textFillColor = $derived(contrastText(color) ? clm('fill-white') : clm('fill-black'));
	const GenreIcon = $derived(icon);
</script>

<div class={clm('relative select-none', classname)}>
	<div
		class={clm(
			'animate-card absolute inset-0 flex flex-col items-center justify-center overflow-hidden rounded-2xl bg-transparent bg-gradient-to-b',
			gradientBackgroundColor
		)}
	>
		{#if imageUrl && !errorImage}
			<Image
				alt={title || 'Иллюстрация истории'}
				class="absolute size-full rounded-inherit"
				cover
				onerror={handleError}
				src={imageUrl}
			/>
			<GenreIcon class={clm('absolute right-4 top-4 h-auto w-1/6 opacity-70', iconColor)} />
		{:else}
			<div class="absolute top-0 flex h-1/2 w-full items-center justify-center">
				<GenreIcon class={clm('h-1/2 w-auto', iconColor)} />
			</div>
		{/if}
		<Titie
			{title}
			color={textFillColor}
			editMode={editMode && !!imageUrl && !errorImage}
			isImage={!!imageUrl && !errorImage}
		/>
	</div>
	<TransparentRect />
</div>
