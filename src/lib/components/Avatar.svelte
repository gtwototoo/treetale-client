<script lang="ts">
	import last from 'lodash/last';

	import type { RGB as RGBType } from '$lib/types';

	import { clm } from '$lib/utils/classMerge';
	import { Image } from 'treetale-ui';

	import type { HTMLImgAttributes } from 'svelte/elements';

	let {
		class: classname,
		alt,
		src,
		size = 'base',
		base64src,
		children,
		onload
	}: Omit<HTMLImgAttributes, 'color'> & {
		size?: 'sm' | 'base' | 'lg';
		onload?: (e: Event) => void;
		color: RGBType;
		base64src?: string | null;
	} = $props();

	let short = $derived.by(() => {
		if (!alt) return '-';

		const split = alt?.split(' ');

		return `${split[0][0]}${split.length > 1 ? last(split)?.[0] : ''}`;
	});

	const sizes = {
		sm: clm('size-10 text-xs'),
		base: clm('size-12 text-base'),
		lg: clm('size-40 text-6xl font-bold')
	};
</script>

<div
	class={clm(
		'relative flex size-12 shrink-0 select-none items-center justify-center rounded-full bg-main bg-gradient-to-b from-contrast/30 to-contrast/50 font-bold text-main',
		sizes[size],
		classname
	)}
>
	{#if src || base64src}
		<Image {alt} {base64src} class="size-full rounded-full" cover {onload} {src} />
	{:else}
		{short}
	{/if}
	{@render children?.()}
</div>

<style lang="postcss">
	.size-lg {
		@apply size-40 text-6xl font-bold;
	}
	.size-base {
		@apply size-12 text-base;
	}
	.size-sm {
		@apply size-10 text-xs;
	}
</style>
