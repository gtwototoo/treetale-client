<script lang="ts">
	import { correctWhitespace } from '$lib/utils';
	import { Photo } from '$UI';
	import clsx from 'clsx';

	import { Photo as PhotoIcon } from 'svelte-heros-v2';

	export let src: string | null = null;
	export let text: string;
	let classes = '';
	export { classes as class };
	export let alt = 'Иллюстрация';
</script>

<div class={clsx('card', classes)}>
	<div class="photoArea">
		<Photo {src} {alt} class="img bg-white" cover width={480}>
			<svelte:fragment slot="error">
				<PhotoIcon class="h-10 w-auto xs:h-16 lg:h-24" variation="solid" />
			</svelte:fragment>
		</Photo>
	</div>
	<div class="content">
		<div
			class={clsx(
				'p-4',
				text && text.length > 100
					? 'text-sm sm:text-base lg:text-lg'
					: 'text-base sm:text-xl lg:text-2xl'
			)}
		>
			{correctWhitespace(text)}
		</div>
		<slot />
	</div>
</div>

<style lang="postcss">
	.card {
		@apply flex w-full max-w-lg flex-col justify-center gap-2 childs:flex;
	}
	.photoArea {
		@apply sticky top-4 flex h-56 shrink-0 flex-col;
	}
	.content {
		@apply z-[1] flex w-full flex-col justify-between gap-6 rounded-2xl bg-white p-4 text-base;
	}
	.content > :global(*) {
		@apply bg-transparent;
	}
	.card :global(.img) {
		@apply h-full w-full rounded-2xl opacity-80;
	}

	@screen sm {
		.content {
			@apply rounded-xl p-6;
		}
		.photoArea {
			@apply h-80 w-80;
		}
		.card {
			@apply max-w-4xl flex-row;
		}
		.card :global(.img) {
			@apply rounded-xl;
		}
	}

	@screen lg {
		.photoArea {
			@apply h-[30rem] w-[30rem];
		}
		.card {
			@apply max-w-6xl;
		}
	}
</style>
