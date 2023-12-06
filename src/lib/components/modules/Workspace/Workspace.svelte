<script lang="ts">
	import clsx from 'clsx';
	import { createEventDispatcher } from 'svelte';

	import ConnectionsLayer from './ConnectionsLayer.svelte';
	import Frame from './Frame/Frame.svelte';
	import MovingArea from './MovingArea.svelte';
	import NewFrame from './NewFrame.svelte';
	import WindowActions from './WindowActions.svelte';

	import { pinch } from '$lib/hooks/pinch';
	import {
		activeActionStore,
		activeModeStore,
		framesDataStore,
		offsetStore,
		zoomCorrect,
		zoomStore
	} from '$lib/stores/workspace';
	import type { ICoordinates } from '$lib/types';

	export let height: number;
	export let width: number;

	let startPinch = 0;
	let workspace: HTMLDivElement;

	const dispatch = createEventDispatcher<{
		mousedown: { doubleClick: boolean; button: number; isMouse: boolean } & ICoordinates;
		mousemove: ICoordinates;
		click: ICoordinates;
		zoom: { zoom: number; offset: ICoordinates };
		mouseup: null;
	}>();

	const handleMouseMove = (e: MouseEvent | TouchEvent) => {
		const isMouse = e instanceof MouseEvent;
		const event = isMouse ? e : e.touches[0];
		const { clientX: x, clientY: y } = event;

		dispatch('mousemove', { x, y });
	};

	const handleMouseDown = (e: MouseEvent | TouchEvent) => {
		const isMouse = e instanceof MouseEvent;
		const event = isMouse ? e : e.touches[0];
		const { clientX: x, clientY: y } = event;

		dispatch('mousedown', {
			doubleClick: isMouse && e.detail === 2,
			button: isMouse && e.button,
			isMouse,
			x,
			y
		});
	};

	const handleMouseUp = () => {
		dispatch('mouseup');
	};

	const handleClick = ({ x, y }: MouseEvent) => {
		dispatch('click', { x, y });
	};

	const handleZoom = (e: WheelEvent | CustomEvent<{ scale: number; center: ICoordinates }>) => {
		const isWheel = e instanceof WheelEvent;
		const { x, y } = isWheel ? e : e.detail.center;
		const upscale = isWheel ? e.deltaY < 0 : e.detail.scale - startPinch > 0;

		const zoomedCoords = zoomCorrect({ x, y });

		if (upscale) {
			if ($zoomStore < 300) {
				$zoomStore += 5;
			}
		} else {
			if ($zoomStore > 10) {
				$zoomStore -= 5;
			}
		}

		$offsetStore = {
			x: Math.round(x - zoomedCoords.x * ($zoomStore / 100)),
			y: Math.round(y - zoomedCoords.y * ($zoomStore / 100))
		};

		if (!isWheel) startPinch = e.detail.scale;

		dispatch('zoom', { zoom: $zoomStore, offset: $offsetStore });
	};
</script>

<WindowActions {workspace} on:mouseup={handleMouseUp} />
<div
	role="treegrid"
	tabindex="0"
	class={clsx(
		'relative h-full w-full select-none overflow-hidden bg-transparent',
		$activeActionStore === 'movingArea' && 'cursor-grabbing',
		$activeActionStore === 'movingFrame' && 'cursor-move'
	)}
	bind:clientHeight={height}
	bind:clientWidth={width}
	bind:this={workspace}
	use:pinch
	on:pinch={handleZoom}
	on:keypress|stopPropagation
	on:wheel|preventDefault={handleZoom}
	on:mousedown={handleMouseDown}
	on:touchstart={handleMouseDown}
	on:touchmove={handleMouseMove}
	on:touchend={handleMouseUp}
	on:mousemove={handleMouseMove}
	on:click={handleClick}
>
	<MovingArea>
		{#if $activeModeStore === 'adding'}
			<NewFrame />
		{/if}
		<div>
			{#each $framesDataStore as { frameId }, key (frameId)}
				<Frame {frameId} index={key} />
			{/each}
		</div>
		<ConnectionsLayer />
	</MovingArea>
</div>
