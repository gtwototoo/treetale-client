<script lang="ts">
	import { changesHistory, connect, frames, storyInfo } from '$lib/stores/editing';
	import { activeAction, selectedFrame } from '$lib/stores/newediting';
	import type { ICoordinates } from '$lib/types';
	import type { IStartMove } from '$lib/types/editing';
	import clsx from 'clsx';
	import { pinch } from 'svelte-gestures';
	import { Square2Stack } from 'svelte-heros-v2';
	import ConnectionsLayer from './ConnectionsLayer.svelte';
	import CreateText from './CreateText.svelte';
	import FramesLayer from './FramesLayer.svelte';
	import MovingArea from './MovingArea.svelte';
	import WindowActions from './WindowActions.svelte';
	import {
		addFrame,
		connectorLogic,
		cursorFollow,
		grabbingArea,
		moveRivet,
		movingFrame,
		startGrab,
		startMoveFrame
	} from './methods';

	let workspace: HTMLDivElement;
	let startPinch = 0;
	let startMoveData: IStartMove = {
		startMoveCoords: { x: 0, y: 0 },
		moveFrameOffset: { x: 0, y: 0 },
		moveXDirection: null
	};
	let startOffset: ICoordinates = { x: 0, y: 0 };

	const handleMouseMove = (e: MouseEvent | TouchEvent) => {
		const isMouse = e instanceof MouseEvent;
		const coordinates = isMouse ? e : e.touches[0];
		const { clientX: x, clientY: y } = coordinates;

		if ($activeAction === 'movingFrame') {
			startMoveData.moveXDirection = movingFrame({ x, y }, startMoveData);
		}
		if ($activeAction === 'movingArea') grabbingArea({ x, y }, startOffset);
		if ($connect.connector.from !== null) moveRivet({ x, y });
		if ($storyInfo.addFrameMode) cursorFollow({ x, y });
	};

	const handleMouseDown = (e: MouseEvent | TouchEvent) => {
		const isMouse = e instanceof MouseEvent;
		const coordinates = isMouse ? e : e.touches[0];
		const { clientX: x, clientY: y } = coordinates;

		if (!isMouse || e.button === 1 || e.detail === 2) startOffset = startGrab({ x, y });
		if (isMouse && e.button === 0 && $selectedFrame) {
			startMoveData = startMoveFrame({ x, y });
		}
	};

	const handleMouseUp = () => {
		if ($activeAction === 'movingFrame') {
			changesHistory.add({
				title: 'Перемещение фрейма',
				icon: Square2Stack
			});
		}

		$selectedFrame = null;
		$activeAction = 'view';

		connectorLogic();
		storyInfo.saveArea();
	};

	const handleClick = ({ x, y }: MouseEvent) => {
		if ($storyInfo.addFrameMode && $storyInfo.addFrameOffset) {
			const addCoords = storyInfo.scaleCorrect({ x, y });

			addFrame({ x: addCoords.x - 128, y: addCoords.y - 112 });
		}
	};

	const handleWheel = ({ deltaY, x, y }: WheelEvent) => {
		const scaledCoords = storyInfo.scaleCorrect({ x, y });

		if (deltaY < 0) {
			if ($storyInfo.scale < 300) {
				$storyInfo.scale += 10;
			}
		} else {
			if ($storyInfo.scale > 10) {
				$storyInfo.scale -= 10;
			}
		}

		$storyInfo.offset = {
			x: Math.round(x - scaledCoords.x * ($storyInfo.scale / 100)),
			y: Math.round(y - scaledCoords.y * ($storyInfo.scale / 100))
		};
	};

	const handlePinch = ({ detail }: CustomEvent) => {
		if (detail.scale - startPinch > 0) {
			if ($storyInfo.scale < 300) {
				$storyInfo.scale += 5;
			}
		} else {
			if ($storyInfo.scale > 10) {
				$storyInfo.scale -= 5;
			}
		}
		startPinch = detail.scale;
	};
</script>

<WindowActions {workspace} />
<div
	class={clsx(
		'absolute h-full w-full select-none overflow-hidden',
		{ 'cursor-grabbing': $activeAction === 'movingArea' },
		{ 'cursor-move': $activeAction === 'movingFrame' }
	)}
	bind:this={workspace}
	use:pinch
	on:keypress|stopPropagation
	on:pinch={handlePinch}
	on:wheel|preventDefault={handleWheel}
	on:mouseup={handleMouseUp}
	on:mousedown={handleMouseDown}
	on:touchstart={handleMouseDown}
	on:touchmove={handleMouseMove}
	on:touchend={handleMouseUp}
	on:mousemove={handleMouseMove}
	on:click={handleClick}
>
	{#if $frames.length === 1}
		<CreateText />
	{/if}
	<MovingArea>
		<FramesLayer />
		<ConnectionsLayer />
	</MovingArea>
</div>
