<script lang="ts">
	import clsx from 'clsx';

	import { correctWhitespace } from '$lib/utils';
	import { Card, Photo } from '$UI';

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
		<Photo
			{src}
			{alt}
			class="h-[23rem] w-full rounded-2xl bg-white"
			cover
			on:error={handleError}
			width={480}
			height={368}
		/>
	{/if}
	<Card
		class={clsx('gap-8 bg-main-20 p-8 childs:bg-transparent max-hd:gap-6 max-hd:p-6', classCard)}
	>
		{#if text}
			<div
				class={clsx(
					'adaptive-padding text-text',
					text && text.length > 50 ? 'adaptive-font' : 'adaptive-font-upper'
				)}
			>
				{correctWhitespace(text)}
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
