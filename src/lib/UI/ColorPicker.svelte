<script lang="ts">
	import type { RGB } from '$lib/types';
	import { InputRange, Popover } from '$UI';
	import { clsx } from 'clsx';
	import { createEventDispatcher } from 'svelte';

	export let disabled: boolean = false;
	export let popoverAlign: 'left' | 'right' = 'right';
	export let lightRange: number[] = [0, 100];
	export let saturateRange: number[] = [0, 100];
	export let light: number = 0;
	export let saturate: number = 0;
	export let color: RGB = [0, 0, 0];

	const dispatch = createEventDispatcher();

	const handleClick = (e: MouseEvent) => {
		if (disabled || !(e.target instanceof HTMLButtonElement)) return;

		const newColor = e.target.style.background.replace(/rgb\((\d*), (\d*), (\d*)\)/, '$1 $2 $3');

		color = newColor.split(' ').map((v) => +v) as RGB;
		dispatch('change', { ...e, color });
	};
</script>

<Popover align={popoverAlign}>
	<svelte:fragment slot="button" let:focused>
		<div class={clsx('picker', focused ? 'ring-blue-500' : 'ring-gray-200', { disabled })}>
			<div class="h-5 w-5 rounded transition-colors" style:background="rgb({color.join(' ')})" />
		</div>
	</svelte:fragment>
	<div class="flex flex-col gap-2 bg-transparent p-2 childs:w-40">
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

<style lang="postcss">
	.picker {
		@apply flex w-9 flex-shrink-0 cursor-pointer items-center justify-center rounded-lg bg-white ring-1 transition-[box-shadow] hover:ring-blue-500 focus:mr-4;
	}
	.disabled {
		@apply pointer-events-none cursor-default bg-gray-100 opacity-40;
	}
</style>
