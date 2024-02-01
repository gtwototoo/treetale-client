<script lang="ts">
	import type { TRGB } from '$lib/types';

	import { Popover } from '$UI';

	import Picker from './Picker.svelte';

	export let disabled = false;
	export let align: 'center' | 'inset' | 'left' | 'right' = 'right';
	export let lightRange = [20, 80];
	export let saturateRange = [10, 90];
	export let light = 0;
	export let saturate = 0;
	export let color: TRGB = [0, 0, 0];
	export let readonly = false;
</script>

<Popover {align} {readonly}>
	<svelte:fragment let:click slot="button">
		<slot {click} {color} />
	</svelte:fragment>
	<Picker bind:color bind:light bind:saturate {disabled} {lightRange} on:change {saturateRange} />
</Popover>
