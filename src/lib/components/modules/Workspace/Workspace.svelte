<script lang="ts">
	import { activeActionStore } from '$lib/stores/newediting';
	import type { ICoordinates } from '$lib/types';
	import ConnectionsLayer from './ConnectionsLayer.svelte';
	import MovingArea from './MovingArea.svelte';
	import WindowActions from './WindowActions.svelte';

	import clsx from 'clsx';
	import { createEventDispatcher, setContext } from 'svelte';
	import { pinch } from 'svelte-gestures';
	import { writable, type Writable } from 'svelte/store';

	export let workspace: HTMLDivElement;

	export let zoom: Writable<number>;
	export let offset: Writable<ICoordinates>;

	const zoomStore = zoom || writable(100);
	const offsetStore = offset || writable({ x: 0, y: 0 });

	setContext('zoom', zoomStore);
	setContext('offset', offsetStore);

	let startPinch = 0;

	const dispatch = createEventDispatcher<{
		mousedown: { doubleClick: boolean; button: number; isMouse: boolean } & ICoordinates;
		mousemove: ICoordinates;
		click: ICoordinates;
		zoom: { zoom: number; offset: ICoordinates };
		mouseup: null;
	}>();

	const scaleCorrect = (coordinates: ICoordinates) => {
		return {
			x: (coordinates.x - $offsetStore.x) / ($zoomStore / 100),
			y: (coordinates.y - $offsetStore.y) / ($zoomStore / 100)
		};
	};

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

	const handleZoom = (e: WheelEvent | CustomEvent<{ center: ICoordinates; scale: number }>) => {
		const isWheel = e instanceof WheelEvent;
		const { x, y } = isWheel ? e : e.detail.center;
		const upscale = isWheel ? e.deltaY < 0 : e.detail.scale - startPinch > 0;

		const scaledCoords = scaleCorrect({ x, y });

		if (upscale) {
			if ($zoomStore < 300) {
				$zoomStore += 10;
			}
		} else {
			if ($zoomStore > 10) {
				$zoomStore -= 10;
			}
		}

		$offsetStore = {
			x: Math.round(x - scaledCoords.x * ($zoomStore / 100)),
			y: Math.round(y - scaledCoords.y * ($zoomStore / 100))
		};

		if (!isWheel) startPinch = e.detail.scale;

		dispatch('zoom', { zoom: $zoomStore, offset: $offsetStore });
	};
</script>

<WindowActions {workspace} />
<div
	role="treegrid"
	tabindex="0"
	class={clsx(
		'h-full w-full select-none relative overflow-hidden bg-transparent',
		$activeActionStore === 'movingArea' && 'cursor-grabbing',
		$activeActionStore === 'movingFrame' && 'cursor-move'
	)}
	bind:this={workspace}
	use:pinch
	on:pinch={handleZoom}
	on:keypress|stopPropagation
	on:wheel|preventDefault={handleZoom}
	on:mouseup={handleMouseUp}
	on:mousedown={handleMouseDown}
	on:touchstart={handleMouseDown}
	on:touchmove={handleMouseMove}
	on:touchend={handleMouseUp}
	on:mousemove={handleMouseMove}
	on:click={handleClick}
>
	<MovingArea>
		<div>
			<slot />
		</div>
		<ConnectionsLayer />
	</MovingArea>
</div>
