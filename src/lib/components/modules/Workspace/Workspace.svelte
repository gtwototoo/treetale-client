<script lang="ts">
	import { page } from '$app/stores';
	import {
		activeAction,
		changesHistory,
		connect,
		frames,
		moveMode,
		storyInfo
	} from '$lib/stores/editing';
	import type { ICoordinates } from '$lib/types';
	import type { IStartMove } from '$lib/types/editing';
	import clsx from 'clsx';
	import { pinch } from 'svelte-gestures';
	import { Square2Stack } from 'svelte-heros-v2';
	import CreateText from './CreateText.svelte';
	import Frame from './Frame/Frame.svelte';
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
	import WindowActions from './WindowActions.svelte';

	let workspace: HTMLDivElement;
	let startPinch = 0;
	let startMoveData: IStartMove = {
		startMoveCoords: { x: 0, y: 0 },
		moveFrameOffset: { x: 0, y: 0 },
		moveXDirection: null
	};
	let startGrabbingOffsets: ICoordinates = { x: 0, y: 0 };

	const handleMouseMove = (e: MouseEvent | TouchEvent) => {
		const { x, y }: ICoordinates =
			e instanceof MouseEvent
				? {
						x: e.clientX,
						y: e.clientY
				  }
				: {
						x: e.touches[0].clientX,
						y: e.touches[0].clientY
				  };

		if ($moveMode.hovered !== null && $moveMode.active)
			startMoveData.moveXDirection = movingFrame({ x, y }, startMoveData);
		if ($storyInfo.grabbing) grabbingArea({ x, y }, startGrabbingOffsets);
		if ($connect.connector.from !== null) moveRivet({ x, y });
		if ($storyInfo.addFrameMode) cursorFollow({ x, y });
	};

	const handleMouseDown = (e: MouseEvent | TouchEvent) => {
		const { x, y }: ICoordinates =
			e instanceof MouseEvent
				? {
						x: e.clientX,
						y: e.clientY
				  }
				: {
						x: e.touches[0].clientX,
						y: e.touches[0].clientY
				  };

		if (!(e instanceof MouseEvent) || e.button === 1 || e.detail === 2)
			startGrabbingOffsets = startGrab({ x, y });
		if (e instanceof MouseEvent && e.button === 0 && $moveMode.hovered !== null) {
			startMoveData = startMoveFrame({ x, y });
		}
	};

	const handleMouseUp = () => {
		if ($moveMode.active) {
			changesHistory.add({
				title: 'Перемещение фрейма',
				icon: Square2Stack
			});
		}

		$storyInfo.grabbing = false;
		$moveMode.active = false;
		$activeAction = 'Перемещение';

		connectorLogic();
		storyInfo.saveArea();
	};

	const handleClick = ({ x, y }: MouseEvent) => {
		if ($storyInfo.addFrameMode && $storyInfo.addFrameOffset) {
			const addCoords = storyInfo.scaleCorrect({ x, y });

			addFrame({ x: addCoords.x - 128, y: addCoords.y - 112 });
		}
	};

	const handleWheel = ({ deltaY }: WheelEvent) => {
		if (deltaY < 0) {
			if ($storyInfo.grabbingScale < 300) {
				$storyInfo.grabbingScale += 10;
			}
		} else {
			if ($storyInfo.grabbingScale > 10) {
				$storyInfo.grabbingScale -= 10;
			}
		}
	};

	const handlePinch = ({ detail }: CustomEvent) => {
		if (detail.scale - startPinch > 0) {
			if ($storyInfo.grabbingScale < 300) {
				$storyInfo.grabbingScale += 5;
			}
		} else {
			if ($storyInfo.grabbingScale > 10) {
				$storyInfo.grabbingScale -= 5;
			}
		}
		startPinch = detail.scale;
	};

	$: ({ error, url } = $page);
</script>

<WindowActions {workspace} />
<div
	class={clsx(
		'w-full grow select-none overflow-hidden',
		{ 'cursor-grabbing': $storyInfo.grabbing },
		{ 'cursor-move': $moveMode.active && $moveMode.hovered }
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
	{#each $frames as data, key (data.frameId)}
		<Frame {key} {data} bind:clientHeight={data.height} bind:clientWidth={data.width} />
	{/each}
	{#if $frames.length === 1}
		<CreateText />
	{/if}
</div>
