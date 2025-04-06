<script lang="ts">
	import { DEFAULT_BLOCK_WIDTH, DEFAULT_FRAME_HEIGHT } from '$lib/constants/index';
	import type { Coordinates } from '$lib/types';
	import Button from '$lib/ui/Button.svelte';
	import { clm } from '$lib/utils/classMerge';

	import { boardFramesStore } from '$board/stores/frames.svelte';
	import { boardParamsStore, boardStateStore } from '$board/stores/index.svelte';
	import { transform } from '$board/utils/coordinatesToCss';

	import { connectedWithStart } from '../methods.svelte';

	let radar = $state<HTMLButtonElement>();

	const calculateCoordinates = (
		coord: number,
		offset: number,
		size: number,
		scale: number,
		radius: number
	) => {
		return ((coord + size / 2) * (boardStateStore.zoom / 100) + offset) * scale - radius;
	};

	const getAreaCoordinates = ({ x, y }: Coordinates, radius: number) => {
		const len = Math.hypot(x, y);
		const isInArea = len <= radius;

		return {
			x: isInArea ? x : (x * radius) / len,
			y: isInArea ? y : (y * radius) / len
		};
	};

	const setCoordinates = (coordinates: Coordinates, offset: Coordinates) => {
		if (!radar) return;

		const radius = radar.clientHeight / 2;
		const scale = radar.clientHeight / Math.min(boardParamsStore.height, boardParamsStore.width);
		const difference = Math.abs(boardParamsStore.width - boardParamsStore.height) / 2;
		const isHorizontal = boardParamsStore.width > boardParamsStore.height;
		const formattedCoordinates: Coordinates = {
			x: calculateCoordinates(
				coordinates.x,
				offset.x - (isHorizontal ? difference : 0),
				DEFAULT_BLOCK_WIDTH,
				scale,
				radius
			),
			y: calculateCoordinates(
				coordinates.y,
				offset.y - (!isHorizontal ? difference : 0),
				DEFAULT_FRAME_HEIGHT,
				scale,
				radius
			)
		};

		return getAreaCoordinates(formattedCoordinates, radius);
	};

	const setDefaultCoordinates = () => {
		boardStateStore.zoom = 100;
		boardStateStore.offset = { x: 0, y: 0 };
	};

	const getTransform = (coordinates: Coordinates, zoom: number, offset: Coordinates) => {
		return transform(setCoordinates(coordinates, offset), zoom / 100);
	};

	const formattedOffset = $derived({
		x: Math.round(boardStateStore.offset.x),
		y: Math.round(boardStateStore.offset.y)
	});
	const formattedZoom = $derived((boardStateStore.zoom / 100).toFixed(1));
</script>

<div
	class={clm(
		'bg-main-200 ring-main-200 z-10 flex items-center gap-2 rounded-full text-sm ring-2',
		boardStateStore.action ? 'blind' : 'pointer-events-auto'
	)}
>
	<Button
		bind:ref={radar!}
		class="bg-contrast size-12 items-center justify-center rounded-full p-0"
		onclick={setDefaultCoordinates}
	>
		<div class="bg-main-200 size-4 rounded-full"></div>
		{#if radar}
			{#each boardFramesStore.frames as { choices, frameId, x, y } (frameId)}
				<div
					class={clm(
						'bg-text absolute h-2.5 w-2.5 shrink-0 rounded-full',
						frameId === 1 && 'z-10 bg-emerald-500',
						connectedWithStart(frameId) && !choices.length && 'bg-blue-500'
					)}
					style={getTransform({ x, y }, boardStateStore.zoom, boardStateStore.offset)}
				></div>
			{/each}
		{/if}
	</Button>
	<div class="text-text mr-4 flex flex-col whitespace-nowrap select-none">
		<p>{formattedOffset.x}, {formattedOffset.y}</p>
		<p>{formattedZoom}x</p>
	</div>
</div>
