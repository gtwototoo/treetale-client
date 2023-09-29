<script lang="ts">
	import { Popover } from '$UI';
	import type { RGB } from '$lib/types';
	import Picker from './Picker.svelte';

	export let disabled = false;
	export let popoverAlign: 'left' | 'right' = 'right';
	export let lightRange: number[] = [0, 100];
	export let saturateRange: number[] = [0, 100];
	export let light = 0;
	export let saturate = 0;
	export let color: RGB = [0, 0, 0];
</script>

{#if $$slots.default}
	<Popover align={popoverAlign}>
		<svelte:fragment slot="button" let:click>
			<slot {click} {color} />
		</svelte:fragment>
		<Picker
			bind:color
			bind:light
			bind:saturate
			{disabled}
			{lightRange}
			{saturateRange}
			on:change
		/>
	</Popover>
{:else}
	<Popover align={popoverAlign} value="Цвет фона">
		<Picker
			bind:color
			bind:light
			bind:saturate
			{disabled}
			{lightRange}
			{saturateRange}
			on:change
		/>
	</Popover>
{/if}
