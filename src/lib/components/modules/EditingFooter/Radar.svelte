<script lang="ts">
	import { storyInfo } from '$lib/stores/editing';
	import { transform } from '$lib/utils';

	import type { ICoordinates } from '$lib/types';
	import { Button } from '$UI';
	import { ViewArea } from '$UI/Icons';
	import clsx from 'clsx';

	let coordinates: ICoordinates = {
		x: 0,
		y: 0
	};
	let innerWidth: number;
	let innerHeight: number;

	const setCoordinates = (offset: ICoordinates) => {
		const radius = 18;
		const formattedCoordinates: ICoordinates = {
			x: -(offset.x / (innerWidth / radius)),
			y: -(offset.y / (innerHeight / radius))
		};

		const len = Math.hypot(formattedCoordinates.x, formattedCoordinates.y);

		if (len > radius) {
			coordinates = {
				x: (formattedCoordinates.x * radius) / len,
				y: (formattedCoordinates.y * radius) / len
			};
		} else {
			coordinates = formattedCoordinates;
		}
	};

	const setDefaultCoordinates = () => {
		$storyInfo.grabbingOffsets = { x: 0, y: 0 };
		$storyInfo.grabbingScale = 100;
	};

	$: setCoordinates($storyInfo.grabbingOffsets);
</script>

<svelte:window bind:innerWidth bind:innerHeight />

<Button class="h-9 w-9 items-center justify-center !rounded-full" on:click={setDefaultCoordinates}>
	<ViewArea
		class={clsx('absolute', {
			'!text-gray-400': Math.abs(coordinates.x) > 6 || Math.abs(coordinates.y) > 6
		})}
	/>
	<div
		class="h-2 w-2 shrink-0 rounded-full !bg-gray-400"
		style={transform(coordinates, $storyInfo.grabbingScale / 100)}
	/>
</Button>
