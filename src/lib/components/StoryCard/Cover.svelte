<script lang="ts">
	import type { SvelteComponent } from 'svelte';

	import clsx from 'clsx';

	import type { TRGB } from '$lib/types';

	import { Image } from '$UI';
	import { contrastText } from '$lib/utils';

	import Titie from './Titie.svelte';
	import TransparentRect from './TransparentRect.svelte';

	let className = '';
	export { className as class };

	export let imageUrl: string;
	export let title: string;
	export let color: TRGB;
	export let icon: typeof SvelteComponent<unknown>;

	let errorImage = false;

	const handleError = () => {
		errorImage = true;
	};

	$: gradientColor = contrastText(color)
		? clsx('from-main to-main-50')
		: clsx('from-main-70 to-main');
	$: iconColor = contrastText(color) ? clsx('text-main-60') : clsx('text-main');
	$: textColor = contrastText(color) ? clsx('fill-white') : clsx('fill-black');
</script>

<div class={clsx('relative select-none', className)}>
	<div
		class={clsx(
			'animate-card absolute inset-0 flex flex-col items-center justify-center overflow-hidden rounded-3xl bg-transparent bg-gradient-to-b',
			gradientColor
		)}
	>
		{#if imageUrl && !errorImage}
			<Image
				alt={title || 'Иллюстрация истории'}
				class="absolute size-full rounded-inherit"
				cover
				on:error={handleError}
				src={imageUrl}
			/>
			<svelte:component
				this={icon}
				class={clsx('absolute right-4 top-4 h-auto w-1/6 opacity-70', iconColor)}
			/>
		{:else}
			<div class="absolute top-0 flex h-1/2 w-full items-center justify-center">
				<svelte:component this={icon} class={clsx('h-1/2 w-auto', iconColor)} />
			</div>
		{/if}
		<Titie {title} {textColor} />
	</div>
	<TransparentRect />
</div>
