<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import type { RGB } from '$lib/types';
	import { Button, InputRange, Popover } from '$UI';
	import { createEventDispatcher } from 'svelte';
	import { ChevronDown } from 'svelte-heros-v2';

	export let disabled = false;
	export let popoverAlign: 'left' | 'right' = 'right';
	export let lightRange: number[] = [0, 100];
	export let saturateRange: number[] = [0, 100];
	export let light = 0;
	export let saturate = 0;
	export let color: RGB = [0, 0, 0];

	const dispatch = createEventDispatcher<{ change: { color: RGB} }>();

	const handleClick = (e: MouseEvent) => {
		if (disabled || !(e.target instanceof HTMLButtonElement)) return;

		const newColor = e.target.style.background.replace(/rgb\((\d*), (\d*), (\d*)\)/, '$1 $2 $3');

		color = newColor.split(' ').map((v) => +v) as RGB;

		dispatch('change', { color });
	};
</script>

<Popover align={popoverAlign} class="-mr-2.5">
	<svelte:fragment slot="button" let:click>
		<Button
			variant="main"
			class="-my-0.5 ml-2 gap-1 bg-main !text-text transition-colors"
			size="sm"
			{disabled}
			on:click={click}
		>
			Цвет
			<Icon type={ChevronDown} class="h-4 w-4" />
		</Button>
	</svelte:fragment>
	<div
		class="flex flex-col gap-2 bg-transparent p-2 childs:w-40"
		style="--color-main: {color.join(' ')}"
	>
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
</Popover>
