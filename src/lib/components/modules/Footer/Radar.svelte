<script lang="ts">
	import { framesDataStore, offsetStore, zoomStore } from '$lib/stores/workspace';
	import type { ICoordinates } from '$lib/types';
	import { clm, transform } from '$lib/utils';
	import { Button } from '$UI';

	export let workspaceHeight: number;
	export let workspaceWidth: number;

	let element: HTMLButtonElement;

	const setCoordinates = (coords: ICoordinates, offset: ICoordinates) => {
		const radius = element.clientHeight / 2;
		const scaleY =
			element && workspaceHeight ? element.clientHeight / workspaceHeight : undefined;
		const scaleX = element && workspaceWidth ? element.clientWidth / workspaceWidth : undefined;

		// тут или offset косячит или надо отнимать радиус
		const formattedCoordinates: ICoordinates = {
			x: ((coords.x + offset.x) * scaleX - radius) * ($zoomStore / 100),
			y: ((coords.y + offset.y) * scaleY - radius) * ($zoomStore / 100)
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
		if (!element) return;

		return transform(setCoordinates(coords, offset), zoom / 100);
	};
</script>

<Button
	bind:element
	size="lg"
	variant="ghost"
	class="h-12 w-12 items-center justify-center !rounded-full bg-contrast !p-0"
	on:click={setDefaultCoordinates}
>
	<div class="h-6 w-6 rounded-full !bg-contrast/20" />
	{#each $framesDataStore as { x, y }, key}
		<div
			class={clm(
				'absolute h-2.5 w-2.5 shrink-0 rounded-full !bg-text',
				!key && 'z-10 !bg-emerald-500'
			)}
			style={getStyle({ x, y }, $zoomStore, $offsetStore)}
		/>
	{/each}
</Button>
