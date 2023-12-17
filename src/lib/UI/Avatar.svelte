<script lang="ts">
	import { Image } from '$UI';
	import { clm, last } from '$lib/utils';

	let className = '';
	export { className as class };

	export let alt: string;
	export let src: string | undefined | null = undefined;
	export let size: 'sm' | 'base' | 'lg' = 'base';
	export let style: string | undefined = undefined;

	const split = alt.split(' ');
	const short = `${split[0][0]}${split.length > 1 ? last(split)?.[0] : ''}`;
</script>

<div
	{style}
	class={clm(
		'relative flex shrink-0 select-none items-center justify-center rounded-full font-bold',
		`size-${size}`,
		className
	)}
>
	{#if src}
		<Image class="h-full w-full rounded-full" cover {src} {alt} />
	{:else}
		{short}
	{/if}
	<slot />
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
