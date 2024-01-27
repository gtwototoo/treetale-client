<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import type { TRGB } from '$lib/types';

	import { InputRange } from '$UI';
	import { RGB } from '$lib/utils';

	export let lightRange: Array<number>;
	export let saturateRange: Array<number>;
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

<div class="flex flex-col gap-4 bg-transparent p-4" style="--color-main: {RGB(color)}">
	<div class="flex flex-col gap-2">
		<div class="flex min-w-0 items-center gap-2">
			<div class="h-3 w-3 rounded bg-gray-700" />
			<InputRange bind:value={light} class="min-w-0" max={lightRange[1]} min={lightRange[0]} />
			<div class="h-3 w-3 rounded bg-gray-100" />
		</div>
		<div class="flex min-w-0 items-center gap-2">
			<div class="h-3 w-3 rounded bg-blue-100" />
			<InputRange
				bind:value={saturate}
				class="min-w-0"
				max={saturateRange[1]}
				min={saturateRange[0]}
			/>
			<div class="h-3 w-3 rounded bg-blue-700" />
		</div>
	</div>
	<div class="flex shrink-0 flex-wrap justify-center gap-2">
		{#each new Array(36) as _, key}
			<button
				class="h-5 w-5 cursor-pointer rounded"
				on:click={handleClick}
				style:background={`hsl(${key * 10 + 5} ${saturate}% ${light}%)`}
			/>
		{/each}
	</div>
</div>
