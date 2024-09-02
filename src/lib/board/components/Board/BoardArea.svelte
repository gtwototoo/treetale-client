<script lang="ts">
	import { onMount } from 'svelte';
	import type { MouseEventHandler, TouchEventHandler } from 'svelte/elements';
	import { on } from 'svelte/events';

	import { type PinchEventHandler, pinch } from '$board/hooks/pinch';
	import { boardCommentsStore } from '$board/stores/comments.svelte';
	import { boardFramesStore } from '$board/stores/frames.svelte';
	import {
		boardParamsStore,
		boardStateStore,
		isAdding,
		zoomCorrect
	} from '$board/stores/index.svelte';

	import type { Coordinates } from '$lib/types';

	import { clm } from '$lib/utils/classMerge';
	import { stopPropagation } from '$lib/utils/eventsModificators';

	import CommentBlock from './CommentBlock.svelte';
	import ConnectionsLayer from './ConnectionsLayer.svelte';
	import CreateText from './CreateText.svelte';
	import FrameBlock from './FrameBlock.svelte';
	import LineManipulators from './LineManipulators.svelte';
	import MovingArea from './MovingArea.svelte';
	import NewBlock from './NewBlock.svelte';
	import WindowActions from './WindowActions.svelte';

	let {
		onclick,
		onmousedown,
		onmousemove,
		onmouseup,
		onzoom
	}: {
		onclick?: (args: Coordinates) => void;
		onmousedown?: (args: {
			button: number;
			doubleClick: boolean;
			isMouse: boolean;
			touchCount: number;
			x: number;
			y: number;
		}) => void;
		onmousemove?: (args: Coordinates) => void;
		onmouseup?: () => void;
		onzoom?: (args: { offset: Coordinates; zoom: number }) => void;
	} = $props();

	let { height, width } = $state({
		height: 0,
		width: 0
	});

	let startPinch = $state(0);
	let board = $state<HTMLDivElement>();

	const handleTouchMove: TouchEventHandler<HTMLDivElement> = (e) => {
		const { clientX: x, clientY: y } = e.touches[0];

		onmousemove?.({ x, y });
	};

	const handleMouseMove: MouseEventHandler<HTMLDivElement> = (e) => {
		const { clientX: x, clientY: y } = e;

		onmousemove?.({ x, y });
	};

	const handleTouchStart: TouchEventHandler<HTMLDivElement> = (e) => {
		const { clientX: x, clientY: y } = e.touches[0];

		onmousedown?.({
			button: 0,
			doubleClick: false,
			isMouse: false,
			touchCount: e.touches.length,
			x,
			y
		});
	};

	const handleMouseDown: MouseEventHandler<HTMLDivElement> = (e) => {
		const { clientX: x, clientY: y } = e;

		onmousedown?.({
			button: e.button,
			doubleClick: e.detail === 2,
			isMouse: true,
			touchCount: 0,
			x,
			y
		});
	};

	const handleClick: MouseEventHandler<HTMLDivElement> = ({ x, y }) => {
		onclick?.({ x, y });
	};

	const handlePinch: PinchEventHandler = (e) => {
		const { x, y } = e.detail.center;
		const upscale = e.detail.scale - startPinch > 0;

		setZoom({ x, y }, upscale);

		startPinch = e.detail.scale;
	};

	const handleWheel = (e: WheelEvent) => {
		e.preventDefault();

		const { x, y } = e;
		const upscale = e.deltaY < 0;

		setZoom({ x, y }, upscale);
	};

	const setZoom = (coords: Coordinates, upscale: boolean) => {
		const { x, y } = coords;
		const zoomedCoords = zoomCorrect({ x, y });

		if (upscale) {
			if (boardStateStore.zoom < 300) {
				boardStateStore.zoom += 5;
			}
		} else {
			if (boardStateStore.zoom > 10) {
				boardStateStore.zoom -= 5;
			}
		}

		boardStateStore.offset = {
			x: Math.round(x - zoomedCoords.x * (boardStateStore.zoom / 100)),
			y: Math.round(y - zoomedCoords.y * (boardStateStore.zoom / 100))
		};

		onzoom?.({ offset: boardStateStore.offset, zoom: boardStateStore.zoom });
	};

	onMount(() => {
		boardParamsStore.width = width;
		boardParamsStore.height = height;

		const off = on(board!, 'wheel', handleWheel, {
			passive: false
		});

		return () => {
			off();
		};
	});
</script>

{#if board}
	<WindowActions {onmouseup} {board} />
{/if}
<div
	bind:clientHeight={height}
	bind:clientWidth={width}
	bind:this={board}
	class={clm(
		'fixed inset-0 size-full select-none overflow-hidden',
		boardStateStore.action === 'movingArea' && 'cursor-grabbing',
		boardStateStore.action === 'movingBlock' && 'cursor-move'
	)}
	onclick={handleClick}
	onkeypress={stopPropagation}
	onmousedown={handleMouseDown}
	onmousemove={handleMouseMove}
	onpinch={handlePinch}
	ontouchend={onmouseup}
	ontouchmove={handleTouchMove}
	ontouchstart={handleTouchStart}
	role="treegrid"
	tabindex="0"
	use:pinch
>
	{#if board}
		{#if boardFramesStore.frames.length <= 1}
			<CreateText />
		{/if}
		<MovingArea>
			{#if isAdding()}
				<NewBlock />
			{/if}
			<div>
				{#each boardCommentsStore.comments as comment (comment.commentId)}
					<CommentBlock {comment} />
				{/each}
			</div>
			<div>
				{#each boardFramesStore.frames as frame (frame.frameId)}
					<FrameBlock {frame} />
				{/each}
			</div>
			<ConnectionsLayer />
			<LineManipulators />
		</MovingArea>
	{/if}
</div>
