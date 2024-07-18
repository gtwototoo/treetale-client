<script lang="ts">
	import type { Snippet } from 'svelte';

	import { Image } from 'treetale-ui';

	import { clm } from '$lib/utils/classMerge';
	import { correctWhitespace } from '$lib/utils/text';

	import Card from './Card.svelte';

	let {
		alt = 'Иллюстрация',
		body,
		children,
		class: classname,
		classCard,
		src = null,
		text
	}: {
		alt?: string;
		body?: Snippet;
		children?: Snippet;
		class?: string;
		classCard?: string;
		src?: null | string;
		text?: string;
	} = $props();

	let errorLoad = $state(false);

	const handleError = () => {
		errorLoad = true;
	};
</script>

<div class={clm('card adaptive-size', classname)}>
	{#if src && !errorLoad}
		<Image
			{alt}
			class="h-[22rem] w-full rounded-2xl !bg-contrast/30 text-text max-xl:h-80 max-md:h-72"
			cover
			on:error={handleError}
			{src}
		/>
	{/if}
	<Card
		class={clm(
			'select-none items-start gap-8 bg-main-10 p-8 text-text max-hd:gap-6 max-hd:p-6',
			classCard
		)}
	>
		{#if text}
			<div
				class={clm(
					'adaptive-padding text-text',
					text && text.length > 50 ? 'adaptive-font' : 'adaptive-font-upper'
				)}
			>
				{@html correctWhitespace(text)}
			</div>
		{:else}
			{@render body?.()}
		{/if}
		{@render children?.()}
	</Card>
</div>

<style lang="postcss">
	.card {
		@apply flex w-full flex-col justify-center gap-2;
	}
	.adaptive-size {
		@apply max-w-[36rem] max-xl:max-w-[32rem] max-md:max-w-[28rem];
	}
</style>
