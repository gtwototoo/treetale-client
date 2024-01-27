<script lang="ts">
	import clsx from 'clsx';

	import { correctWhitespace } from '$lib/utils';
	import { Card, Image } from '$UI';

	let className = '';
	export { className as class };

	let errorLoad = false;

	export let classCard = '';
	export let src: null | string = null;
	export let text: string | undefined = undefined;
	export let alt = 'Иллюстрация';

	const handleError = () => {
		errorLoad = true;
	};
</script>

<div class={clsx('card adaptive-size', className)}>
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
		class={clsx(
			'select-none items-start gap-8 bg-main-10 p-8 text-text childs:bg-transparent max-hd:gap-6 max-hd:p-6',
			classCard
		)}
	>
		{#if text}
			<div
				class={clsx(
					'adaptive-padding text-text',
					text && text.length > 50 ? 'adaptive-font' : 'adaptive-font-upper'
				)}
			>
				{@html correctWhitespace(text)}
			</div>
		{:else}
			<slot name="body" />
		{/if}
		<slot />
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
