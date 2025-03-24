<script lang="ts">
	import type { HTMLImgAttributes } from 'svelte/elements';

	import { clm } from '$lib/utils/classMerge';

	import Image from './Image.svelte';

	const {
		class: classname,
		alt,
		src,
		base64src,
		children,
		onload
	}: HTMLImgAttributes & {
		onload?: (e: Event) => void;
		base64src?: string | null;
	} = $props();

	const getInitials = (name?: string | null) => {
		if (!name) return '-';

		const split = name.split(' ');
		const last = split[split.length - 1];

		return `${split[0][0]}${split.length > 1 ? last?.[0] : ''}`.toUpperCase();
	};

	let short = $derived(getInitials(alt));
</script>

<div
	class={clm(
		'bg-main-400 text-main ring-main relative flex shrink-0 items-center justify-center rounded-full font-bold ring-1 select-none',
		classname
	)}
>
	{#if src || base64src}
		<Image {alt} {base64src} class="rounded-inherit size-full" cover {onload} {src} />
	{:else}
		{short}
	{/if}
	{@render children?.()}
</div>
