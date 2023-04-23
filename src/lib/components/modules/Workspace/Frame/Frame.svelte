<script lang="ts">
	import { currentPanel } from '$lib/stores/main';
	import { activeAction, panelFrame, selectedFrame } from '$lib/stores/newediting';
	import type { IFrameCreate } from '$lib/types/editing';
	import { transform } from '$lib/utils';
	import clsx from 'clsx';
	import FrameSettings from '../../Panel/FrameSettings.svelte';
	import Choices from './Choices.svelte';
	import Header from './Header.svelte';

	export let data: IFrameCreate;
	export let key: number;

	const setMovingFrame = () => {
		if ($activeAction === 'movingFrame') return;

		$selectedFrame = data.frameId;
	};

	const setCurrentFrame = () => {
		$panelFrame = data;

		$currentPanel = {
			id: String(data.frameId),
			title: !key ? 'Начало' : data.title,
			component: FrameSettings
		};
	};

	const removeMovingFrame = () => {
		if ($activeAction === 'movingFrame') return;

		$selectedFrame = null;
	};
</script>

<button
	class={clsx(
		'absolute z-10 flex w-64 cursor-move select-none flex-col items-stretch gap-3 rounded-lg bg-gray-100 p-2 text-sm/4 transition-shadow hover:shadow',
		{ shadow: $selectedFrame === data.frameId }
	)}
	style="{transform({ x: data.x, y: data.y })}; z-index: {data.frameId}"
	on:mouseenter={setMovingFrame}
	on:mouseleave={removeMovingFrame}
	on:click={setCurrentFrame}
>
	<Header {data}>
		<p class={clsx('py-1 pl-4', { 'text-emerald-600': !key })}>
			{!key ? 'Начало' : data.title}
		</p>
	</Header>
	{#if !data.hidden}
		<div class={clsx('flex h-20 items-center px-4 text-center', { 'text-gray-400': !data.text })}>
			<p class="line-clamp-5 w-full">{data.text || 'Описание истории'}</p>
		</div>
		<Choices {data} />
	{/if}
</button>
