<script lang="ts">
	import type { MouseEventHandler } from 'svelte/elements';

	import range from 'lodash/range';

	import type { RGB } from '$lib/types';
	import { toRGB } from '$lib/utils/customColors';

	import Range from './Range.svelte';

	let {
		onchange,
		saturateRange = [10, 90],
		lightRange = [20, 80],
		light = $bindable(),
		saturate = $bindable(),
		color = $bindable(),
		disabled
	}: {
		onchange?: (color: RGB) => void;
		lightRange?: number[];
		saturateRange?: number[];
		light?: number;
		saturate?: number;
		color: RGB;
		disabled: boolean;
	} = $props();

	const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
		if (disabled || !(e.target instanceof HTMLButtonElement)) return;

		const newColor = e.target.style.background.replace(/rgb\((\d*), (\d*), (\d*)\)/, '$1 $2 $3');

		color = newColor.split(' ').map((v) => +v) as RGB;

		onchange?.(color);
	};
</script>

<div class="flex w-96 flex-col gap-4 bg-transparent p-4" style="--color-main: {toRGB(color)}">
	<div class="flex flex-col gap-2">
		<div class="flex min-w-0 items-center gap-2">
			<div class="size-4 rounded-full bg-gray-700 ring-1 ring-gray-900"></div>
			<Range
				value={light}
				onchange={(value) => (light = value)}
				class="min-w-0 grow"
				max={lightRange[1]}
				min={lightRange[0]}
			/>
			<div class="size-4 rounded-full bg-gray-100 ring-1 ring-gray-200"></div>
		</div>
		<div class="flex min-w-0 items-center gap-2">
			<div class="size-4 rounded-full bg-blue-100 ring-1 ring-blue-200"></div>
			<Range
				value={saturate}
				onchange={(value) => (saturate = value)}
				class="min-w-0 grow"
				max={saturateRange[1]}
				min={saturateRange[0]}
			/>
			<div class="size-4 rounded-full bg-blue-700 ring-1 ring-blue-900"></div>
		</div>
	</div>
	<div class="flex shrink-0 flex-wrap justify-center gap-2">
		{#each range(36) as index (index)}
			{@const color = `hsl(${index * 10 + 5} ${saturate}% ${light}%)`}
			<button
				class="size-5 cursor-pointer rounded"
				aria-label="Цвет {color}"
				onclick={handleClick}
				style:background={color}
			></button>
		{/each}
	</div>
</div>
