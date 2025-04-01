<script lang="ts">
	import type { Component } from 'svelte';

	import { theme } from '$lib/stores/colors.svelte';
	import Image from '$lib/ui/Image.svelte';
	import { clm } from '$lib/utils/classMerge';

	import Titie from './Titie.svelte';
	import TransparentRect from './TransparentRect.svelte';

	const {
		class: classname,
		editMode,
		icon,
		imageUrl,
		title
	}: {
		class?: string;
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
		theme.type === 'dark' ? clm('from-main to-main-800') : clm('from-main-500 to-main')
	);
	const iconColor = $derived(theme.type === 'dark' ? clm('text-main-600') : clm('text-main'));
	const textFillColor = $derived(theme.type === 'dark' ? clm('fill-white') : clm('fill-black'));
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
				class="rounded-inherit absolute size-full"
				cover
				onerror={handleError}
				src={imageUrl}
			/>
			<GenreIcon class={clm('absolute top-4 right-4 h-auto w-1/6 opacity-70', iconColor)} />
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

<style lang="postcss">
	@reference "../../../app.css";

	.animate-card {
		@apply from-50% to-100% bg-[length:100%_200%] bg-[0%_-100%] transition-[background-position,transform] hover:bg-[0%_-120%];
	}
</style>
