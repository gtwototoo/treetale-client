<script lang="ts">
	import {
		boardFramesStore,
		connectionStartStore,
		movingFrameStore,
		selectedFrameStore
	} from '$board/stores/frames.svelte';
	import { changesHistoryStore } from '$board/stores/history.svelte';
	import { boardStateStore, readonlyModeStore } from '$board/stores/index.svelte';
	import { panelStatesStore } from '$board/stores/panel.svelte';
	import { transform } from '$board/utils/coordinatesToCss';
	import { createConnections } from '$board/utils/editing';
	import find from 'lodash/find';
	import { Share } from 'svelte-heros-v2';
	import { Image } from 'treetale-ui';

	import type { Frame } from '$lib/types';

	import { currentThemeClass } from '$lib/stores/colors.svelte';
	import { clm } from '$lib/utils/classMerge';
	import { preventDefault } from '$lib/utils/eventsModificators';

	import { connectedWithStart, setSelectedFrame } from '../methods.svelte';
	import Choices from './Frame/Choices.svelte';
	import Header from './Frame/Header.svelte';

	let {
		frame
	}: {
		frame: Frame;
	} = $props();

	const handleMouseDown = () => {
		if (!frame) return;

		if (isConnectRequest) {
			return;
		}

		if (!readonlyModeStore.isEnabled) {
			movingFrameStore.frameId = frame.frameId;
		}

		if (panelStatesStore.id !== `frame-${frame.frameId}`) {
			setSelectedFrame(frame);
		}
	};

	const setVisible = () => {
		frame.hidden = !frame.hidden;

		createConnections(boardFramesStore.frames);
	};

	const createConnection = () => {
		if (!isConnectRequest) return;

		const { choiceId, frameId } = connectionStartStore;

		const fromFrame = find(boardFramesStore.frames, { frameId: frameId! })!;
		const choice = find(fromFrame.choices, { choiceId: choiceId! })!;

		choice.frameId = frame.frameId;

		connectionStartStore.clear();

		changesHistoryStore.add('Добавление связи', Share);
	};

	let isEndFrame = $derived(connectedWithStart(frame.frameId) && !frame.choices.length);
	let isConnectRequest = $derived(
		boardStateStore.mode === 'binding' &&
			connectionStartStore.frameId &&
			connectionStartStore.frameId !== frame.frameId
	);
	let { hidden, imageUrl, text, x, y } = $derived(frame);
	let greenHoverBackgroundColor = $derived(
		currentThemeClass(clm('hover:!bg-emerald-800'), clm('hover:!bg-emerald-200'))
	);
	let style = $derived([transform({ x, y }), `z-index: ${frame.frameId}`].join(';'));
	let isDragging = $derived(movingFrameStore.frameId === frame.frameId);
	let isSelected = $derived(selectedFrameStore.frameId === frame.frameId);
</script>

{#if frame}
	<div
		role="button"
		tabindex="0"
		bind:clientHeight={frame.height}
		{style}
		class={clm(
			'group absolute z-10 flex w-64 select-none flex-col items-stretch gap-3 rounded-lg bg-contrast p-2 text-sm/4 text-text ring-2 ring-main',
			!readonlyModeStore.isEnabled && 'cursor-move hover:ring-text',
			isDragging && '!ring-4 ring-text',
			isSelected && 'ring-text',
			boardStateStore.mode === 'binding' &&
				clm(
					'!bg-main-70',
					connectionStartStore.frameId &&
						connectionStartStore.frameId !== frame.frameId &&
						clm(greenHoverBackgroundColor, 'cursor-pointer !bg-contrast')
				)
		)}
		onkeydown={preventDefault}
		onclick={createConnection}
		ontouchstart={handleMouseDown}
		onmousedown={handleMouseDown}
	>
		<Header
			{frame}
			onhide={setVisible}
			start={frame.frameId === 1}
			end={isEndFrame}
			{isDragging}
			{isSelected}
		/>
		{#if !hidden}
			{#if imageUrl}
				<Image
					alt="Изображение блока"
					class="h-36 w-full rounded-lg !bg-main/30 text-text"
					cover
					src={frame.imageUrl}
				/>
			{/if}
			<div class={clm('flex h-20 items-center px-4 text-center', !text && 'text-gray-400')}>
				<div class="line-clamp-5 w-full break-words text-left">
					{@html text || 'Описание блока'}
				</div>
			</div>
			<Choices {frame} {isDragging} {isSelected} />
		{/if}
	</div>
{/if}
