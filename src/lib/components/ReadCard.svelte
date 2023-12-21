<script lang="ts">
	import clsx from 'clsx';

	import { correctWhitespace } from '$lib/utils';
	import { Card, Image } from '$UI';

	let className = '';
	export { className as class };

	let errorLoad = false;

	export let classCard = '';
	export let src: string | null = null;
	export let text: string | undefined = undefined;
	export let alt = 'Иллюстрация';

	const handleError = () => {
		errorLoad = true;
	};
</script>

<div class={clsx('card', className)}>
	{#if src && !errorLoad}
		<Image
			{src}
			{alt}
			class="h-80 w-full rounded-2xl bg-contrast/30 text-text max-hd:h-72 max-xl:h-64 max-md:h-56 max-sm:h-48"
			cover
			on:error={handleError}
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
		@apply flex w-full max-w-[36rem] flex-col justify-center gap-2;
	}
</style>
