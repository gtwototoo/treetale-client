<script lang="ts">
	import { changesHistory } from '$lib/stores/editing';
	import { currentPanelStore } from '$lib/stores/main';
	import { activeActionStore, movingFrameStore, selectedFrameStore } from '$lib/stores/newediting';
	import type { IChoice } from '$lib/types';
	import type { IFrameCreate } from '$lib/types/editing';
	import { transform } from '$lib/utils';
	import { getChoicePosition } from '$lib/utils/editing';
	import clsx from 'clsx';
	import { Plus, XMark } from 'svelte-heros-v2';
	import FrameSettings from '../../Panel/FrameSettings.svelte';
	import Choices from './Choices.svelte';
	import Header from './Header.svelte';

	export let data: IFrameCreate;
	export let key: number;
	export let clientHeight = undefined;
	export let clientWidth = undefined;

	const setMovingFrame = () => {
		if ($activeActionStore === 'movingFrame') return;

		$movingFrameStore = data.frameId;
	};

	const setCurrentFrame = () => {
		if ($currentPanelStore.id === `frame-${data.frameId}`) return;

		$selectedFrameStore = data.frameId;

		$currentPanelStore = {
			id: `frame-${data.frameId}`,
			title: !key ? 'Начало' : data.title,
			component: FrameSettings
		};
	};

	const setChoices = (e: CustomEvent<IChoice[]>) => {
		if (e.detail > data.choices) {
			changesHistory.add('Добавление выбора', Plus);
		} else {
			changesHistory.add('Удаление выбора', XMark);
		}

		data.choices = e.detail;
	};

	const unsetMovingFrame = () => {
		if ($activeActionStore === 'movingFrame') return;

		$movingFrameStore = null;
	};

	const setVisible = () => {
		data.hidden = !data.hidden;
	};
</script>

<div class="absolute" style="{transform({ x: data.x, y: data.y })}; z-index: {data.frameId}">
	<button
		class={clsx(
			'relative z-10 flex w-64 cursor-move select-none flex-col items-stretch gap-3 rounded-lg bg-white p-2 text-sm/4 transition-shadow hover:shadow-lg',
			{ 'shadow-lg': $movingFrameStore === data.frameId }
		)}
		on:mouseenter={setMovingFrame}
		on:mouseleave={unsetMovingFrame}
		on:click={setCurrentFrame}
		bind:clientHeight
		bind:clientWidth
	>
		<Header hidden={data.hidden} on:hide={setVisible}>
			<p class={clsx('py-1 pl-4', { 'text-emerald-500': !key })}>
				{!key ? 'Начало' : data.title}
			</p>
		</Header>
		{#if !data.hidden}
			<div
				class={clsx('flex h-20 items-center px-4 text-center', { 'text-gray-400': !data.text })}
			>
				<p class="line-clamp-5 w-full">{data.text || 'Описание истории'}</p>
			</div>
			<Choices choices={data.choices} on:change={setChoices} />
		{/if}
	</button>
	<div class="absolute inset-0">
		{#each data.choices as _, key}
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
