<script lang="ts">
	import { ADAPTIVE_FONT, ADAPTIVE_FONT_UPPER, ADAPTIVE_PADDING } from '$lib/constants';
	import { correctWhitespace } from '$lib/utils';
	import { Card, Photo } from '$UI';
	import clsx from 'clsx';

	let className = '';
	export { className as class };

	let errorLoad = false;

	export let classCard = '';
	export let src: string | null = null;
	export let text: string;
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
	<Card class={clsx('p-8 gap-8 max-hd:p-6 max-hd:gap-6', classCard)}>
		<div
			class={clsx(
				text && text.length > 50 ? ADAPTIVE_FONT : ADAPTIVE_FONT_UPPER,
				ADAPTIVE_PADDING
			)}
		>
			{correctWhitespace(text)}
		</div>
		<slot />
	</Card>
</div>

<style lang="postcss">
	.card {
		@apply flex w-full max-w-[36rem] flex-col justify-center gap-2;
	}
</style>
