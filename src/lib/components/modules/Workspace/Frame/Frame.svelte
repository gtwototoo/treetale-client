<script lang="ts">
	import { changesHistory } from '$lib/stores/editing';
	import { framesDataStore, movingFrameStore } from '$lib/stores/workspace';
	import type { IChoice } from '$lib/types';
	import { transform } from '$lib/utils';
	import { getChoicePosition } from '$lib/utils/editing';
	import clsx from 'clsx';
	import { Plus, XMark } from 'svelte-heros-v2';
	import Choices from './Choices.svelte';
	import Header from './Header.svelte';

	export let frameId: number;
	export let key: number;

	$: frame = $framesDataStore.findIndex((frame) => frame.frameId === frameId);
	$: ({ choices, hidden, title, text, x, y } = $framesDataStore[frame]);

	const setMovingFrame = () => {
		$movingFrameStore = frameId;
	};

	const setChoices = (e: CustomEvent<IChoice[]>) => {
		if (e.detail > choices) {
			changesHistory.add('Добавление выбора', Plus);
		} else {
			changesHistory.add('Удаление выбора', XMark);
		}

		$framesDataStore[frame].choices = e.detail;
	};

	const setVisible = () => {
		$framesDataStore[frame].hidden = !hidden;
	};
</script>

<div class="absolute" style="{transform({ x, y })}; z-index: {frameId}">
	<button
		class={clsx(
			'relative z-10 flex w-64 cursor-move select-none flex-col items-stretch gap-3 rounded-lg bg-white p-2 text-sm/4 transition-shadow hover:shadow-lg',
			{ 'shadow-lg': $movingFrameStore === frameId }
		)}
		on:mousedown={setMovingFrame}
		bind:clientHeight={$framesDataStore[frame].height}
		bind:clientWidth={$framesDataStore[frame].width}
	>
		<Header {hidden} on:hide={setVisible}>
			<p class={clsx('py-1 pl-4', { 'text-emerald-500': !key })}>
				{!key ? 'Начало' : title}
			</p>
		</Header>
		{#if !hidden}
			<div
				class={clsx('flex h-20 items-center px-4 text-center', {
					'text-gray-400': !text
				})}
			>
				<p class="line-clamp-5 w-full">{text || 'Описание истории'}</p>
			</div>
			<Choices {choices} on:change={setChoices} />
		{/if}
	</button>
	<div class="absolute inset-0">
		{#each choices as _, key}
			<div class="point right-0" style="top: {getChoicePosition(key)}px" />
		{/each}
		<div class="point left-0 top-1/2" />
	</div>
</div>

<style lang="postcss">
	.point {
		@apply absolute flex items-center justify-center bg-white after:absolute after:h-3 after:w-3 after:rounded-full after:bg-inherit after:transition-[width,height,background];
	}
</style>
