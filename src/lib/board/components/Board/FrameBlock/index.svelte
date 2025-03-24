<script lang="ts">
	import find from 'lodash/find';
	import { Share } from 'svelte-heros-v2';

	import { currentThemeClass } from '$lib/stores/colors.svelte';
	import type { Frame } from '$lib/types';
	import Image from '$lib/ui/Image.svelte';
	import { clm } from '$lib/utils/classMerge';
	import { preventDefault } from '$lib/utils/eventsModificators';

	import { movingBlockStore } from '$board/stores/blocks.svelte';
	import { boardFramesStore, connectionStartStore } from '$board/stores/frames.svelte';
	import { changesHistoryStore } from '$board/stores/history.svelte';
	import { isBindingMode, readonlyModeStore } from '$board/stores/index.svelte';
	import { panelStatesStore } from '$board/stores/panel.svelte';
	import { transform } from '$board/utils/coordinatesToCss';
	import { createConnections } from '$board/utils/editing';

	import { connectedWithStart, setSelectedFrame } from '../../methods.svelte';

	import Choices from './Choices.svelte';
	import Header from './Header.svelte';

	const {
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
			movingBlockStore.id = frame.frameId;
			movingBlockStore.type = 'frame';
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
		isBindingMode() &&
			connectionStartStore.frameId &&
			connectionStartStore.frameId !== frame.frameId
	);
	let { hidden, imageUrl, text, x, y } = $derived(frame);
	let greenHoverBackgroundColor = $derived(
		currentThemeClass(clm('hover:!bg-emerald-800'), clm('hover:!bg-emerald-200'))
	);
	let style = $derived([transform({ x, y }), `z-index: ${frame.frameId}`].join(';'));
	let isDragging = $derived(
		movingBlockStore.type === 'frame' && movingBlockStore.id === frame.frameId
	);
	let isSelected = $derived(panelStatesStore.props?.frameId === frame.frameId);
	let isSelectedBindingChoice = $derived(
		isBindingMode() &&
			connectionStartStore.frameId !== null &&
			connectionStartStore.frameId !== frame.frameId
	);
</script>

{#if frame}
	<div
		role="button"
		tabindex="0"
		bind:clientHeight={frame.height}
		{style}
		class={clm(
			'group bg-contrast text-text ring-main absolute z-10 flex w-64 flex-col items-stretch gap-3 rounded-lg p-2 text-sm/4 ring-2 select-none',
			!readonlyModeStore.isEnabled && 'hover:ring-text cursor-move',
			isDragging && 'ring-text !ring-4',
			isSelected && 'ring-text',
			isBindingMode() && 'bg-main-200',
			isSelectedBindingChoice &&
				clm(greenHoverBackgroundColor, '!bg-contrast cursor-pointer hover:ring-green-500')
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
			{isSelectedBindingChoice}
		/>
		{#if !hidden}
			{#if imageUrl}
				<Image
					alt="Изображение блока"
					class="!bg-main/30 text-text h-36 w-full rounded-lg"
					cover
					src={frame.imageUrl}
				/>
			{/if}
			<div class={clm('flex h-20 items-center px-4 text-center', !text && 'text-gray-400')}>
				<div class="line-clamp-5 w-full text-left break-words">
					{@html text || 'Описание блока'}
				</div>
			</div>
			<Choices {frame} {isDragging} {isSelected} {isSelectedBindingChoice} />
		{/if}
	</div>
{/if}
