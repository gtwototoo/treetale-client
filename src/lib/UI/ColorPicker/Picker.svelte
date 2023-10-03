<script lang="ts">
	import { InputRange } from '$UI';
	import type { TRGB } from '$lib/types';
	import { RGB } from '$lib/utils';
	import { createEventDispatcher } from 'svelte';

	export let lightRange: number[];
	export let saturateRange: number[];
	export let light: number;
	export let saturate: number;
	export let color: TRGB;
	export let disabled: boolean;

	const dispatch = createEventDispatcher<{ change: { color: TRGB } }>();

	const handleClick = (e: MouseEvent) => {
		if (disabled || !(e.target instanceof HTMLButtonElement)) return;

		const newColor = e.target.style.background.replace(/rgb\((\d*), (\d*), (\d*)\)/, '$1 $2 $3');

		color = newColor.split(' ').map((v) => +v) as TRGB;

		dispatch('change', { color });
	};
</script>

<div class="flex flex-col gap-2 bg-transparent p-2 childs:w-40" style="--color-main: {RGB(color)}">
	<div class="flex items-center gap-2">
		<div class="h-3 w-3 rounded bg-gray-700" />
		<InputRange min={lightRange[0]} max={lightRange[1]} bind:value={light} class="min-w-0" />
		<div class="h-3 w-3 rounded bg-gray-100" />
	</div>
	<div class="flex items-center gap-2">
		<div class="h-3 w-3 rounded bg-blue-100" />
		<InputRange
			min={saturateRange[0]}
			max={saturateRange[1]}
			bind:value={saturate}
			class="min-w-0"
		/>
		<div class="h-3 w-3 rounded bg-blue-700" />
	</div>
	<div class="flex shrink-0 flex-wrap gap-2">
		{#each new Array(36) as _, key}
			<button
				style:background={`hsl(${key * 10 + 5} ${saturate}% ${light}%)`}
				class="h-5 w-5 cursor-pointer rounded"
				on:click={handleClick}
			/>
		{/each}
	</div>
</div>
