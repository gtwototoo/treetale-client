<script lang="ts">
	import type { ComponentProps, Snippet } from 'svelte';

	import type { RGB } from '$lib/types';

	import Button from './Button.svelte';
	import Modal from './Modal.svelte';
	import Picker from './Picker.svelte';

	type ColorPickerProps = {
		button: Snippet<[{ color?: RGB }]>;
		class?: string;
		disabled?: boolean;
	} & Pick<
		ComponentProps<typeof Picker>,
		'light' | 'saturate' | 'color' | 'saturateRange' | 'lightRange' | 'onchange'
	>;

	let {
		onchange,
		saturateRange,
		lightRange,
		light = 0,
		saturate = 0,
		color = [0, 0, 0],
		disabled = false,
		class: classname,
		button
	}: ColorPickerProps = $props();

	let active = $state(false);
</script>

<Button onclick={() => (active = true)} class={classname} {disabled}>
	{@render button({ color })}
</Button>
<Modal bind:active>
	<Picker bind:color bind:light bind:saturate {disabled} {lightRange} {onchange} {saturateRange} />
</Modal>
