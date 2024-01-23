<script lang="ts">
	import Picker from './Picker.svelte';

	import { Popover } from '$UI';
	import type { TRGB } from '$lib/types';

	export let disabled = false;
	export let popoverAlign: 'left' | 'right' | 'inset' = 'right';
	export let lightRange = [0, 100];
	export let saturateRange = [0, 100];
	export let light = 0;
	export let saturate = 0;
	export let color: TRGB = [0, 0, 0];
	export let readonly = false;
</script>

{#if $$slots.default}
	<Popover align={popoverAlign} {readonly}>
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
	<Popover align={popoverAlign} {disabled} value="Цвет фона" btnClass="bg-main" {readonly}>
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
