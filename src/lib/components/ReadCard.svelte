<script lang="ts">
	import type { Snippet } from 'svelte';

	import { Image } from 'treetale-ui';

	import { clm } from '$lib/utils/classMerge';
	import { correctWhitespace } from '$lib/utils/text';

	let {
		alt = 'Иллюстрация',
		body,
		children,
		class: classname,
		readCard = $bindable<HTMLDivElement>(),
		src = null,
		text
	}: {
		alt?: string;
		body?: Snippet;
		children?: Snippet;
		class?: string;
		classCard?: string;
		readCard?: HTMLDivElement;
		src?: null | string;
		text?: string;
	} = $props();

	let errorLoad = $state(false);

	const handleError = () => {
		errorLoad = true;
	};
</script>

<div
	bind:this={readCard}
	class={clm(
		'flex w-full max-w-screen-lg flex-col items-start gap-6 text-left font-RobotoSlab',
		classname
	)}
>
	<div class="flex w-full flex-col gap-4 border-l-2 border-main px-4 text-text">
		{#if src && !errorLoad}
			<Image
				{alt}
				class="h-[clamp(100px,33vw,330px)] w-full rounded-2xl bg-main-40 text-text"
				cover
				on:error={handleError}
				{src}
			/>
		{/if}
		{#if text}
			<div
				class={clm(
					'clear-text px-2',
					text && text.length > 50 ? 'adaptive-font' : 'adaptive-font-upper'
				)}
			>
				{@html correctWhitespace(text)}
			</div>
		{:else}
			{@render body?.()}
		{/if}
	</div>
	{@render children?.()}
</div>
