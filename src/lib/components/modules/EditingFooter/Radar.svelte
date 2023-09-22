<script lang="ts">
	import { storyInfo } from '$lib/stores/editing';
	import { transform } from '$lib/utils';

	import type { ICoordinates } from '$lib/types';
	import { Button } from '$UI';
	import { ViewArea } from '$UI/Icons';
	import clsx from 'clsx';

	export let viewArea: HTMLElement;

	let element: HTMLButtonElement;
	let coordinates: ICoordinates = {
		x: 0,
		y: 0
	};

	const setCoordinates = (offset: ICoordinates) => {
		if (!element) return;

		const radius = element.clientHeight / 2;
		const formattedCoordinates: ICoordinates = {
			x: -(offset.x / (viewArea.clientWidth / radius)),
			y: -(offset.y / (viewArea.clientHeight / radius))
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
		$storyInfo.offset = { x: 0, y: 0 };
		$storyInfo.scale = 100;
	};

	$: setCoordinates($storyInfo.offset);
</script>

<Button
	bind:element
	size="lg"
	variant="ghost"
	class="items-center !p-3 justify-center !rounded-full bg-contrast"
	on:click={setDefaultCoordinates}
>
	<ViewArea
		class={clsx('text-text w-6 h-6', {
			'!text-gray-400': Math.abs(coordinates.x) > 6 || Math.abs(coordinates.y) > 6
		})}
	/>
	<div
		class="h-3 w-3 shrink-0 rounded-full absolute !bg-text"
		style={transform(coordinates, $storyInfo.scale / 100)}
	/>
</Button>
