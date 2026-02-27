<script lang="ts">
	import { onMount } from 'svelte';
	import type { MouseEventHandler, TouchEventHandler } from 'svelte/elements';
	import { on } from 'svelte/events';

	import type { Coordinates } from '$lib/types';
	import { clm } from '$lib/utils/classMerge';
	import { stopPropagation } from '$lib/utils/eventsModificators';

	import { type PinchEventHandler, pinch } from '$board/hooks/pinch';
	import { boardCommentsStore } from '$board/stores/comments.svelte';
	import { boardFramesStore } from '$board/stores/frames.svelte';
	import {
		boardParamsStore,
		boardStateStore,
		isAddingMode,
		zoomCorrect
	} from '$board/stores/index.svelte';

	import CommentBlock from './CommentBlock.svelte';
	import ConnectionsLayer from './ConnectionsLayer.svelte';
	import CreateText from './CreateText.svelte';
	import FrameBlock from './FrameBlock/index.svelte';
	import LineManipulators from './LineManipulators.svelte';
	import MovingArea from './MovingArea.svelte';
	import NewBlock from './NewBlock.svelte';
	import WindowActions from './WindowActions.svelte';

	const {
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

	let pinchStartScale = $state<number | null>(null);
	let pinchStartZoom = $state(100);
	let board = $state<HTMLDivElement>();

	const resetPinch = () => {
		pinchStartScale = null;
		pinchStartZoom = boardStateStore.zoom;
	};

	const handleTouchMove: TouchEventHandler<HTMLDivElement> = (e) => {
		if (e.touches.length > 1) {
			e.preventDefault();
		}

		const { clientX: x, clientY: y } = e.touches[0];

		onmousemove?.({ x, y });
	};

	const handleMouseMove: MouseEventHandler<HTMLDivElement> = (e) => {
		const { clientX: x, clientY: y } = e;

		onmousemove?.({ x, y });
	};

	const handleTouchStart: TouchEventHandler<HTMLDivElement> = (e) => {
		if (e.touches.length >= 2) {
			resetPinch();
		}

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

		if (pinchStartScale === null) {
			pinchStartScale = e.detail.scale;
			pinchStartZoom = boardStateStore.zoom;
		}

		const nextZoom = pinchStartZoom * (e.detail.scale / pinchStartScale);

		setZoom({ x, y }, nextZoom);
	};

	const handleWheel = (e: WheelEvent) => {
		e.preventDefault();

		const { x, y } = e;
		const upscale = e.deltaY < 0;

		setZoom({ x, y }, boardStateStore.zoom + (upscale ? 5 : -5));
	};

	const setZoom = (coords: Coordinates, nextZoom: number) => {
		const { x, y } = coords;
		const zoomedCoords = zoomCorrect({ x, y });
		const clampedZoom = Math.max(10, Math.min(300, Math.round(nextZoom)));

		if (clampedZoom === boardStateStore.zoom) {
			return;
		}

		boardStateStore.zoom = clampedZoom;

		boardStateStore.offset = {
			x: Math.round(x - zoomedCoords.x * (boardStateStore.zoom / 100)),
			y: Math.round(y - zoomedCoords.y * (boardStateStore.zoom / 100))
		};

		onzoom?.({ offset: boardStateStore.offset, zoom: boardStateStore.zoom });
	};

	const handleTouchEnd: TouchEventHandler<HTMLDivElement> = (e) => {
		if (e.touches.length < 2) {
			resetPinch();
		}

		onmouseup?.();
	};

	onMount(() => {
		boardParamsStore.width = board!.clientWidth;
		boardParamsStore.height = board!.clientHeight;

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
	bind:this={board}
	class={clm(
		'fixed inset-0 size-full overflow-hidden select-none',
		boardStateStore.action === 'movingArea' && 'cursor-grabbing',
		boardStateStore.action === 'movingBlock' && 'cursor-move'
	)}
	onclick={handleClick}
	onkeypress={stopPropagation}
	onmousedown={handleMouseDown}
	onmousemove={handleMouseMove}
	onpinch={handlePinch}
	ontouchcancel={handleTouchEnd}
	ontouchend={handleTouchEnd}
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
			{#if isAddingMode()}
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
