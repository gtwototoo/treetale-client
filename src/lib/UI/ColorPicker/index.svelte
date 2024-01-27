<script lang="ts">
	import type { TRGB } from '$lib/types';

	import { Popover } from '$UI';

	import Picker from './Picker.svelte';

	export let disabled = false;
	export let popoverAlign: 'inset' | 'left' | 'right' = 'right';
	export let lightRange = [0, 100];
	export let saturateRange = [0, 100];
	export let light = 0;
	export let saturate = 0;
	export let color: TRGB = [0, 0, 0];
	export let readonly = false;
</script>

{#if $$slots.default}
	<Popover align={popoverAlign} {readonly}>
		<svelte:fragment let:click slot="button">
			<slot {click} {color} />
		</svelte:fragment>
		<Picker
			bind:color
			bind:light
			bind:saturate
			{disabled}
			{lightRange}
			on:change
			{saturateRange}
		/>
	</Popover>
{:else}
	<Popover align={popoverAlign} btnClass="bg-main" {disabled} {readonly} value="Цвет фона">
		<Picker
			bind:color
			bind:light
			bind:saturate
			{disabled}
			{lightRange}
			on:change
			{saturateRange}
		/>
	</Popover>
{/if}
