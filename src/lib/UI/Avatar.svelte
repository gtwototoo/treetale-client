<script lang="ts">
	import { Image } from '$UI';
	import { BLACK_COLOR, WHITE_COLOR } from '$lib/constants';
	import type { TRGB } from '$lib/types';
	import { RGB, alphaToRgb, clm, contrastText, last } from '$lib/utils';

	let className = '';
	export { className as class };

	export let alt: string;
	export let src: string | undefined | null = undefined;
	export let size: 'sm' | 'base' | 'lg' = 'base';
	export let color: TRGB;
	export let base64src = '';

	const split = alt.split(' ');
	const short = `${split[0][0]}${split.length > 1 ? last(split)?.[0] : ''}`;

	$: colorMain50 = alphaToRgb(color, 0.5, contrastText(color) ? BLACK_COLOR : WHITE_COLOR);
	$: colorContrast = contrastText(color) ? BLACK_COLOR : WHITE_COLOR;
	$: colorMain90 = alphaToRgb(color, 0.9, contrastText(color) ? BLACK_COLOR : WHITE_COLOR);
</script>

<div
	class="contents"
	style:--color-contrast={RGB(colorContrast)}
	style:--color-main={RGB(color)}
	style:--color-main-50={RGB(colorMain50)}
	style:--color-main-90={RGB(colorMain90)}
>
	<div
		class={clm(
			'relative flex shrink-0 select-none items-center justify-center rounded-full bg-gradient-to-t from-main-90 to-main-50 font-bold text-main',
			`size-${size}`,
			className
		)}
	>
		{#if src || base64src}
			<Image class="h-full w-full rounded-full" cover {src} {alt} {base64src} on:load />
		{:else}
			{short}
		{/if}
		<slot />
	</div>
</div>

<style lang="postcss">
	.size-lg {
		@apply h-40 w-40 text-6xl font-bold;
	}
	.size-base {
		@apply h-12 w-12 text-base;
	}
	.size-sm {
		@apply h-9 w-9 text-xs;
	}
</style>
