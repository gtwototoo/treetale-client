<script lang="ts">
	import { correctWhitespace } from '$lib/utils';
	import { Card, Photo } from '$UI';
	import clsx from 'clsx';

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
			class="bg-white w-full h-[23rem] rounded-2xl"
			cover
			on:error={handleError}
			width={480}
			height={368}
		/>
	{/if}
	<Card
		class={clsx(
			'p-8 gap-8 max-hd:p-6 max-hd:gap-6 bg-opacity-80 childs:bg-transparent',
			classCard
		)}
	>
		{#if text}
			<div
				class={clsx(
					'adaptive-padding',
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
