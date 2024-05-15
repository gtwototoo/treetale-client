<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import clsx from 'clsx';

	import type { ICoordinates } from '$lib/types';

	import { pinch } from '$lib/hooks/pinch';
	import {
		activeActionStore,
		activeModeStore,
		framesDataStore,
		offsetStore,
		zoomCorrect,
		zoomStore
	} from '$lib/stores/workspace';

	import ConnectionsLayer from './ConnectionsLayer.svelte';
	import Frame from './Frame/Frame.svelte';
	import LineManipulators from './LineManipulators.svelte';
	import MovingArea from './MovingArea.svelte';
	import NewFrame from './NewFrame.svelte';
	import WindowActions from './WindowActions.svelte';

	export let height: number;
	export let width: number;

	let startPinch = 0;
	let workspace: HTMLDivElement;

	const dispatch = createEventDispatcher<{
		click: ICoordinates;
		mousedown: { button: number; doubleClick: boolean; isMouse: boolean } & ICoordinates;
		mousemove: ICoordinates;
		mouseup: null;
		zoom: { offset: ICoordinates; zoom: number };
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
			button: isMouse && e.button,
			doubleClick: isMouse && e.detail === 2,
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

	const handleZoom = (e: CustomEvent<{ center: ICoordinates; scale: number }> | WheelEvent) => {
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

		dispatch('zoom', { offset: $offsetStore, zoom: $zoomStore });
	};
</script>

<WindowActions on:mouseup={handleMouseUp} {workspace} />
<div
	bind:clientHeight={height}
	bind:clientWidth={width}
	bind:this={workspace}
	class={clsx(
		'relative h-full w-full select-none overflow-hidden bg-transparent',
		$activeActionStore === 'movingArea' && 'cursor-grabbing',
		$activeActionStore === 'movingFrame' && 'cursor-move'
	)}
	on:click={handleClick}
	on:keypress|stopPropagation
	on:mousedown={handleMouseDown}
	on:mousemove={handleMouseMove}
	on:pinch={handleZoom}
	on:touchend={handleMouseUp}
	on:touchmove={handleMouseMove}
	on:touchstart={handleMouseDown}
	on:wheel|preventDefault={handleZoom}
	role="treegrid"
	tabindex="0"
	use:pinch
>
	<MovingArea>
		{#if $activeModeStore === 'adding'}
			<NewFrame />
		{/if}
		<div>
			{#each $framesDataStore as { frameId } (frameId)}
				<Frame {frameId} />
			{/each}
		</div>
		<ConnectionsLayer />
		<LineManipulators />
	</MovingArea>
</div>
