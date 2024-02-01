<script lang="ts">
	import type { ICoordinates } from '$lib/types';

	import { Button } from '$UI';
	import { DEFAULT_FRAME_SIZE } from '$lib/constants';
	import { framesDataStore, offsetStore, zoomStore } from '$lib/stores/workspace';
	import { clm, transform } from '$lib/utils';

	export let workspaceHeight: number;
	export let workspaceWidth: number;

	let element: HTMLButtonElement;

	const setCoordinates = (coords: ICoordinates, offset: ICoordinates) => {
		const radius = element.clientHeight / 2;
		const scale = element.clientHeight / Math.min(workspaceHeight, workspaceWidth);
		const difference = Math.abs(workspaceWidth - workspaceHeight) / 2;
		const squareOffset: ICoordinates =
			workspaceWidth > workspaceHeight ? { x: difference, y: 0 } : { x: 0, y: difference };

		const formattedCoordinates: ICoordinates = {
			x:
				((coords.x + DEFAULT_FRAME_SIZE.width / 2) * ($zoomStore / 100) +
					offset.x -
					squareOffset.x) *
					scale -
				radius,
			y:
				((coords.y + DEFAULT_FRAME_SIZE.height / 2) * ($zoomStore / 100) +
					offset.y -
					squareOffset.y) *
					scale -
				radius
		};

		const len = Math.hypot(formattedCoordinates.x, formattedCoordinates.y);

		return len > radius
			? {
					x: (formattedCoordinates.x * radius) / len,
					y: (formattedCoordinates.y * radius) / len
				}
			: formattedCoordinates;
	};

	const setDefaultCoordinates = () => {
		$zoomStore = 100;
		$offsetStore = { x: 0, y: 0 };
	};

	const getStyle = (coords: ICoordinates, zoom: number, offset: ICoordinates) => {
		return transform(setCoordinates(coords, offset), zoom / 100);
	};
</script>

<Button
	bind:element
	class="h-12 w-12 items-center justify-center !rounded-full bg-contrast !p-0"
	on:click={setDefaultCoordinates}
	size="lg"
	variant="ghost"
>
	<div class="size-6 rounded-full !bg-contrast/20" />
	{#if element && workspaceHeight}
		{#each $framesDataStore as { frameId, x, y }, key (frameId)}
			<div
				class={clm(
					'absolute h-2.5 w-2.5 shrink-0 rounded-full !bg-text',
					!key && 'z-10 !bg-emerald-500'
				)}
				style={getStyle({ x, y }, $zoomStore, $offsetStore)}
			/>
		{/each}
	{/if}
</Button>
