<script lang="ts">
	import { framesDataStore, movingFrameStore } from '$lib/stores/workspace';
	import { transform } from '$lib/utils';
	import { getChoicePosition } from '$lib/utils/editing';
	import clsx from 'clsx';
	import Choices from './Choices.svelte';
	import Header from './Header.svelte';

	export let frameId: number;
	export let index: number;

	$: frameKey = $framesDataStore.findIndex((frame) => frame.frameId === frameId);

	const setMovingFrame = () => {
		$movingFrameStore = frameId;
	};

	const setVisible = () => {
		$framesDataStore[frameKey].hidden = !$framesDataStore[frameKey].hidden;
	};
</script>

{#if frameKey !== -1}
	{@const { choices, hidden, title, text, x, y } = $framesDataStore[frameKey]}
	<div class="absolute" style="{transform({ x, y })}; z-index: {frameId}">
		<button
			class={clsx(
				'relative z-10 flex w-64 cursor-move select-none flex-col items-stretch gap-3 rounded-lg bg-white p-2 text-sm/4 transition-shadow hover:shadow-lg',
				{ 'shadow-lg': $movingFrameStore === frameId }
			)}
			on:mousedown={setMovingFrame}
			bind:clientHeight={$framesDataStore[frameKey].height}
			bind:clientWidth={$framesDataStore[frameKey].width}
		>
			<Header {hidden} on:hide={setVisible}>
				<p class={clsx('py-1 pl-4', { 'text-emerald-500': !index })}>
					{!index ? 'Начало' : title}
				</p>
			</Header>
			{#if !hidden}
				<div
					class={clsx('flex h-20 items-center px-4 text-center', {
						'text-gray-400': !text
					})}
				>
					<p class="line-clamp-5 w-full break-words">{text || 'Описание фрейма'}</p>
				</div>
				<Choices {frameKey} />
			{/if}
		</button>
		<div class="absolute inset-0">
			{#each choices as _, key}
				<div class="point right-0" style:top="{getChoicePosition(key)}px" />
			{/each}
			<div class="point left-0 top-1/2" />
		</div>
	</div>
{/if}

<style lang="postcss">
	.point {
		@apply absolute flex items-center justify-center bg-white after:absolute after:h-3 after:w-3 after:rounded-full after:bg-inherit after:transition-[width,height,background];
	}
</style>
