<script lang="ts">
	import Picker from './Picker.svelte';

	import { Popover } from '$UI';
	import { readonlyStore } from '$lib/stores/editing';
	import type { TRGB } from '$lib/types';

	export let disabled = false;
	export let popoverAlign: 'left' | 'right' = 'right';
	export let lightRange = [0, 100];
	export let saturateRange = [0, 100];
	export let light = 0;
	export let saturate = 0;
	export let color: TRGB = [0, 0, 0];
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
	<Popover align={popoverAlign} {disabled} value="Цвет фона" readonly={$readonlyStore}>
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
